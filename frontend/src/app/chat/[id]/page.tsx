import ChatBase from "@/components/chat/ChatBase";
import { fetchChats } from "@/fetch/chatsFetch";

import { fetchChatGroup, fetchChatGroupUsers } from "@/fetch/groupFetch";
import { notFound } from "next/navigation";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "../../api/auth/[...nextauth]/options";

export default async function chat({ params }: { params: { id: string } }) {
  if (params.id.length !== 36) {
    return notFound();
  }
  
  const session: CustomSession | null = await getServerSession(authOptions);
  const token = session?.user?.token || undefined;
  
  const chatGroup: GroupChatType | null = await fetchChatGroup(params.id, token);
  if (chatGroup === null) {
    return notFound();
  }
  const chatGroupUsers: Array<GroupChatUserType> | [] =
    await fetchChatGroupUsers(params?.id, token);
  const chats: Array<MessageType> | [] = await fetchChats(params.id, token);

  return (
    <div>
      <ChatBase group={chatGroup} users={chatGroupUsers} oldMessages={chats} token={token} />
    </div>
  );
}