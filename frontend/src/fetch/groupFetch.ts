import { CHAT_GROUP, CHAT_GROUP_USERS } from "@/lib/apiAuthRoutes";

export async function fetchChatGroups(token: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = token; // Token already includes "Bearer " prefix
  }
  
  const res = await fetch(CHAT_GROUP, {
    headers,
    next: {
      revalidate: 60 * 60,
      tags: ["dashboard"],
    },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return [];
}

export async function fetchChatGroup(id: string, token?: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = token; // Token already includes "Bearer " prefix
  }
  
  const res = await fetch(`${CHAT_GROUP}/${id}`, {
    headers,
    cache: "no-cache",
  });

  if (!res.ok) {
    // Log the status for debugging
    console.error(`fetchChatGroup failed with status: ${res.status}, statusText: ${res.statusText}`);
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return null;
}

export async function fetchChatGroupUsers(id: string, token?: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = token; // Token already includes "Bearer " prefix
  }
  
  const res = await fetch(`${CHAT_GROUP_USERS}?group_id=${id}`, {
    headers,
    cache: "no-cache",
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error(`fetchChatGroupUsers failed with status: ${res.status}, statusText: ${res.statusText}`);
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return [];
}