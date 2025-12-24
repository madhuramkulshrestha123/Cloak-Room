import { Request, Response } from "express";
import prisma from "../config/db.config.js";

class ChatsController {
  static async index(req: Request, res: Response) {
    const { groupId } = req.params;
    const chats = await prisma.chats.findMany({
      where: {
        group_id: groupId,
      },
    });
    return res.json({ data: chats });
  }

  static async store(req: Request, res: Response) {
    try {
      const { group_id, message, name, file } = req.body;
      
      const newChat = await prisma.chats.create({
        data: {
          group_id,
          message,
          name,
          file: file || null,
        },
      });
      
      return res.status(201).json({
        message: "Message saved successfully!",
        data: newChat,
      });
    } catch (error) {
      console.error("Error saving message:", error);
      return res.status(500).json({ message: "Something went wrong. Please try again!" });
    }
  }
}

export default ChatsController;
