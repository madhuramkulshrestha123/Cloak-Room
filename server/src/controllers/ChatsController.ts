import { Request, Response } from "express";
import db from "../config/db.config.js";

class ChatsController {
  static async index(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Check if the user has access to the chat group (owner or member)
      const groupResult = await db.query(`
        SELECT cg.id 
        FROM chat_groups cg 
        WHERE cg.id = $1 AND (cg.user_id = $2 OR EXISTS(
          SELECT 1 FROM group_users gu WHERE gu.group_id = cg.id AND gu.user_id = $3
        ))
      `, [groupId, user.id, user.id]);
      
      if (groupResult.rows.length === 0) {
        return res.status(404).json({ message: "Chat group not found or access denied" });
      }
      
      const chatsResult = await db.query(
        'SELECT * FROM chats WHERE group_id = $1 ORDER BY created_at ASC',
        [groupId]
      );
      return res.json({ data: chatsResult.rows });
    } catch (error) {
      console.error("ChatsController.index error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }
}

export default ChatsController;