import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../config/db.config.js";
import bcrypt from "bcrypt";

interface LoginPayloadType {
  name?: string;
  email: string;
  oauth_id?: string;
  provider: string;
  image?: string;
  username?: string;
  password?: string;
  age?: number;
}

interface ManualRegistrationPayload {
  username: string;
  name?: string;
  email: string;
  password: string;
  age: number;
}

interface ManualLoginPayload {
  email: string;
  username?: string;
  password: string;
}

class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const body: LoginPayloadType = req.body;
      
      // Check if this is a Google OAuth login
      if (body.oauth_id) {
        // Google OAuth login flow
        const findUserResult = await db.query(
          'SELECT * FROM users WHERE email = $1',
          [body.email]
        );

        let findUser = findUserResult.rows[0];

        if (!findUser) {
          // Create new user for Google OAuth
          const createUserResult = await db.query(
            'INSERT INTO users (name, email, provider, oauth_id, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [body.name, body.email, body.provider, body.oauth_id, body.image]
          );
          findUser = createUserResult.rows[0];
        }

        let JWTPayload = {
          name: findUser.name,
          email: findUser.email,
          id: findUser.id,
        };

        if (!process.env.JWT_SECRET) {
          return res.status(500).json({ message: "JWT Secret is not defined" });
        }
        const token = jwt.sign(JWTPayload, process.env.JWT_SECRET, {
          expiresIn: "365d",
        });
        return res.json({
          message: "Logged in successfully!",
          user: {
            ...findUser,
            token: `Bearer ${token}`,
          },
        });
      } else if (body.email && body.password) {
        // Manual login flow
        let findUserResult;
        
        if (body.username) {
          // Login with username
          findUserResult = await db.query(
            'SELECT * FROM users WHERE (username = $1 OR email = $1) AND provider = \'manual\'',
            [body.username]
          );
        } else {
          // Login with email
          findUserResult = await db.query(
            'SELECT * FROM users WHERE email = $1 AND provider = \'manual\'',
            [body.email]
          );
        }

        const findUser = findUserResult.rows[0];

        if (!findUser) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(body.password, findUser.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        let JWTPayload = {
          name: findUser.name,
          email: findUser.email,
          id: findUser.id,
        };

        if (!process.env.JWT_SECRET) {
          return res.status(500).json({ message: "JWT Secret is not defined" });
        }
        const token = jwt.sign(JWTPayload, process.env.JWT_SECRET, {
          expiresIn: "365d",
        });
        return res.json({
          message: "Logged in successfully!",
          user: {
            ...findUser,
            token: `Bearer ${token}`,
          },
        });
      } else {
        return res.status(400).json({ message: "Invalid login request" });
      }
    } catch (error) {
      console.error("AuthController.login error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again!" });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { username, name, email, password, age }: ManualRegistrationPayload = req.body;

      // Validate required fields
      if (!username || !email || !password || !age) {
        return res.status(400).json({ message: "All fields are required: username, email, password, age" });
      }

      // Validate age (must be above 18)
      if (age < 18) {
        return res.status(400).json({ message: "Age must be above 18" });
      }

      // Check if user already exists
      const existingUserResult = await db.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUserResult.rows.length > 0) {
        return res.status(409).json({ message: "User with this email or username already exists" });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const createUserResult = await db.query(
        'INSERT INTO users (username, name, email, password, provider, age) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [username, name || username, email, hashedPassword, 'manual', age]
      );

      const findUser = createUserResult.rows[0];

      let JWTPayload = {
        name: findUser.name,
        email: findUser.email,
        id: findUser.id,
      };

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT Secret is not defined" });
      }
      const token = jwt.sign(JWTPayload, process.env.JWT_SECRET, {
        expiresIn: "365d",
      });
      return res.json({
        message: "User registered successfully!",
        user: {
          ...findUser,
          token: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("AuthController.register error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again!" });
    }
  }
}

export default AuthController;