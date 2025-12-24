import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket.config";
import { Input } from "../ui/input";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { CHATS_URL } from "@/lib/apiAuthRoutes";

export default function Chats({
  group,
  oldMessages,
  chatUser,
}: {
  group: GroupChatType;
  oldMessages: Array<MessageType> | [];
  chatUser?: GroupChatUserType;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<MessageType>>(
    () => [...oldMessages].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  );
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const socket = useMemo(() => {
    const socketInstance = getSocket(group.id);
    socketInstance.auth = { room: group.id };
    return socketInstance;
  }, [group.id]);

  useEffect(() => {
    // Set up socket event listeners
    const handleConnect = () => {
      setSocketConnected(true);
      console.log("Socket connected with ID:", socket.id);
    };
    
    const handleDisconnect = () => {
      setSocketConnected(false);
      console.log("Socket disconnected");
    };
    
    const handleMessage = (data: MessageType) => {
      console.log("Received message via socket:", data);
      // Add message if not already in the list
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(msg => msg.id === data.id);
        if (!messageExists) {
          // Add the new message and ensure chronological order
          const updatedMessages = [...prevMessages, data];
          return updatedMessages.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        }
        return prevMessages;
      });
      scrollToBottom();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive_message", handleMessage);

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive_message", handleMessage);
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [socket]);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!message.trim()) return;
    
    const payload: MessageType = {
      id: uuidv4(),
      message: message,
      name: chatUser?.name ?? "Unknown",
      created_at: new Date().toISOString(),
      group_id: group.id,
    };
    
    // Add message optimistically to UI
    setMessages(prev => [...prev, payload]);
    
    // Emit via WebSocket for real-time delivery to other users
    if (socketConnected) {
      socket.emit("send_message", payload);
    }
    
    // Also save to database via API
    axios.post(`${CHATS_URL}`, {
      group_id: group.id,
      message: message,
      name: chatUser?.name ?? "Unknown",
    })
    .catch(error => {
      console.error("Error saving message to database:", error);
      // If saving failed, we might want to remove the message from UI or mark it as unsent
    });
    
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[94vh]  p-4">
      <div className="flex-1 overflow-y-auto flex flex-col-reverse">
        <div ref={messagesEndRef} />
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-sm rounded-lg p-2 ${
                message.name === chatUser?.name
                  ? "bg-gradient-to-r from-blue-400 to-blue-600  text-white self-end"
                  : "bg-gradient-to-r from-gray-200 to-gray-300 text-black self-start"
              }`}
            >
              <div className="text-xs mb-1 opacity-50">{message.name}</div>
              <div>{message.message}</div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}
