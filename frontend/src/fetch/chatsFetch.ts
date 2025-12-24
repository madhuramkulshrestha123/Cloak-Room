import { CHATS_URL } from "@/lib/apiAuthRoutes";

export async function fetchChats(groupId: string, token?: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = token; // Token already includes "Bearer " prefix
  }
  
  const res = await fetch(`${CHATS_URL}/${groupId}`, {
    headers,
    cache: "no-cache",
  });

  if (!res.ok) {
    // Log the status for debugging
    console.error(`fetchChats failed with status: ${res.status}, statusText: ${res.statusText}`);
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return [];
}