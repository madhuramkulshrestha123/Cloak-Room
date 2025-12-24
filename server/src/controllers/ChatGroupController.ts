import { Request, Response } from "express";
import db from "../config/db.config.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

class ChatGroupController {
  static async index(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Get chat groups where the user is the owner
      const ownedGroupsResult = await db.query(
        'SELECT * FROM chat_groups WHERE user_id = $1 ORDER BY created_at DESC',
        [user.id]
      );
      
      // Get chat groups where the user is a member
      const memberGroupsResult = await db.query(`
        SELECT cg.* 
        FROM chat_groups cg 
        JOIN group_users gu ON cg.id = gu.group_id 
        WHERE gu.user_id = $1
        ORDER BY cg.created_at DESC
      `, [user.id]);
      
      // Combine both results, removing duplicates
      const allGroups = [...ownedGroupsResult.rows, ...memberGroupsResult.rows];
      const uniqueGroups = allGroups.filter((group, index, self) => 
        index === self.findIndex(g => g.id === group.id)
      );
      
      return res.json({ data: uniqueGroups });
    } catch (error) {
      console.error("ChatGroupController.index error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      if (id) {
        // Check if the user is the owner of the chat group OR is a member of the chat group
        const groupResult = await db.query(`
          SELECT cg.* 
          FROM chat_groups cg 
          WHERE cg.id = $1 AND (cg.user_id = $2 OR EXISTS(
            SELECT 1 FROM group_users gu WHERE gu.group_id = cg.id AND gu.user_id = $3
          ))
        `, [id, user.id, user.id]);
        
        const group = groupResult.rows[0];
        if (!group) {
          return res.status(404).json({ message: "Chat group not found or access denied" });
        }
        
        return res.json({ data: group });
      }

      return res.status(404).json({ message: "No groups found" });
    } catch (error) {
      console.error("ChatGroupController.show error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      await db.query(
        'INSERT INTO chat_groups (title, passcode, user_id) VALUES ($1, $2, $3)',
        [body?.title, body?.passcode, user.id]
      );

      return res.json({ message: "Chat Group created successfully!" });
    } catch (error) {
      console.error("ChatGroupController.store error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      if (id) {
        // Only allow the owner to update the chat group
        const checkResult = await db.query(
          'SELECT id FROM chat_groups WHERE id = $1 AND user_id = $2',
          [id, user.id]
        );
        
        if (checkResult.rows.length === 0) {
          return res.status(404).json({ message: "Chat group not found" });
        }
        
        await db.query(
          'UPDATE chat_groups SET title = $1, passcode = $2 WHERE id = $3',
          [body.title, body.passcode, id]
        );
        return res.json({ message: "Group updated successfully!" });
      }

      return res.status(404).json({ message: "No groups found" });
    } catch (error) {
      console.error("ChatGroupController.update error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Only allow the owner to delete the chat group
      const checkResult = await db.query(
        'SELECT id FROM chat_groups WHERE id = $1 AND user_id = $2',
        [id, user.id]
      );
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: "Chat group not found" });
      }
      
      await db.query(
        'DELETE FROM chat_groups WHERE id = $1',
        [id]
      );
      return res.json({ message: "Chat Deleted successfully!" });
    } catch (error) {
      console.error("ChatGroupController.destroy error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }
}

export default ChatGroupController;