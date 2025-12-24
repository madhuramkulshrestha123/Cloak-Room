import { Request, Response } from "express";
import db from "../config/db.config.js";

interface GroupUserType {
  name: string;
  group_id: string;
  passcode?: string; // Added passcode for joining groups
}

class ChatGroupUserController {
  static async index(req: Request, res: Response) {
    try {
      const { group_id } = req.query;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // First check if the user has access to the chat group
      const groupResult = await db.query(`
        SELECT cg.id, cg.passcode 
        FROM chat_groups cg 
        WHERE cg.id = $1 AND (cg.user_id = $2 OR EXISTS(
          SELECT 1 FROM group_users gu WHERE gu.group_id = cg.id AND gu.user_id = $3
        ))
      `, [group_id as string, user.id, user.id]);
      
      if (groupResult.rows.length === 0) {
        return res.status(404).json({ message: "Chat group not found or access denied" });
      }
      
      const usersResult = await db.query(
        'SELECT * FROM group_users WHERE group_id = $1',
        [group_id as string]
      );

      return res.json({ message: "Date fetched successfully!", data: usersResult.rows });
    } catch (error) {
      console.error("ChatGroupUserController.index error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const body: GroupUserType = req.body;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Check if the chat group exists and get its passcode
      const groupResult = await db.query(
        'SELECT passcode, user_id FROM chat_groups WHERE id = $1',
        [body.group_id]
      );
      
      if (groupResult.rows.length === 0) {
        return res.status(404).json({ message: "Chat group not found" });
      }
      
      const group = groupResult.rows[0];
      
      // Check if the passcode is correct (for joining existing groups)
      if (body.passcode !== group.passcode) {
        return res.status(401).json({ message: "Invalid passcode" });
      }
      
      // Check if user is already in the group
      const existingUserResult = await db.query(
        'SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2',
        [body.group_id, user.id]
      );
      
      if (existingUserResult.rows.length > 0) {
        return res.status(409).json({ message: "User already exists in this group" });
      }
      
      // Add the user to the group
      const userResult = await db.query(
        'INSERT INTO group_users (name, group_id, user_id) VALUES ($1, $2, $3) RETURNING *',
        [body.name || user.name, body.group_id, user.id]
      );
      const userCreated = userResult.rows[0];
      return res.json({ message: "User added to group successfully!", data: userCreated });
    } catch (error) {
      console.error("ChatGroupUserController.store error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }
}

export default ChatGroupUserController;