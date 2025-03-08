import { toast } from "sonner";

type Callback = (members: DiscordMember[]) => void;
let subscriber: Callback | null = null;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const DISCORD_PUBLIC_TOKEN = import.meta.env.VITE_DISCORD_PUBLIC_TOKEN;

if (!API_URL || !DISCORD_PUBLIC_TOKEN) {
  console.warn("VITE_API_URL or VITE_DISCORD_PUBLIC_TOKEN is not defined, using default values");
}

export async function fetchToken(): Promise<string> {
  const res = await fetch(`${API_URL}/api/token`);
  if (!res.ok) throw new Error(`Failed to fetch token: ${res.statusText}`);
  const { token } = await res.json();
  return token;
}

export async function fetchMembers(token: string): Promise<DiscordMember[]> {
  const res = await fetch(`${API_URL}/api/members?token=${token}`);
  if (!res.ok) throw new Error(`Failed to fetch members: ${res.statusText}`);
  const { data } = await res.json();
  return data;
}

export function subscribeToMembers(callback: Callback): () => void {
  subscriber = callback;
  let intervalId: NodeJS.Timeout;

  const startPolling = async () => {
    try {
      const token = await fetchToken();
      intervalId = setInterval(async () => {
        try {
          const members = await fetchMembers(token);
          if (subscriber) subscriber(members);
        } catch (error) {
          console.error("Error fetching members:", error);
          toast.error("Failed to update members");
        }
      }, 5000);
    } catch (error) {
      console.error("Error initializing polling:", error);
      toast.error("Failed to connect to server");
    }
  };

  startPolling();

  return () => {
    subscriber = null;
    if (intervalId) clearInterval(intervalId);
  };
}

export const requestMemberUpdate = async (): Promise<void> => {
  try {
    const token = await fetchToken();
    const members = await fetchMembers(token);
    if (subscriber) subscriber(members);
  } catch (error) {
    console.error("Error requesting member update:", error);
    toast.error("Failed to refresh members");
  }
};

export interface Role {
  name: string;
  color?: string;
  position: number;
}

export interface MemberStatus {
  online: boolean;
  mic: boolean;
  sound: boolean;
}

export interface DiscordMember {
  id: string;
  name: string;
  avatar?: string;
  roles: Role[];
  isBot: boolean;
  isOwner: boolean;
  joinedAt?: string;
  status: MemberStatus;
}