import { toast } from "sonner";

type Callback = (members: DiscordMember[]) => void;
let subscriber: Callback | null = null;
const API_URL = window.location.origin;

// Добавляем задержку между запросами
const POLLING_INTERVAL = 10000; // 10 секунд
const RETRY_DELAY = 5000; // 5 секунд

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
  let isPolling = false;

  const startPolling = async () => {
    if (isPolling) return;
    isPolling = true;

    try {
      const token = await fetchToken();
      
      const poll = async () => {
        try {
          const members = await fetchMembers(token);
          if (subscriber) subscriber(members);
          // Планируем следующий запрос
          intervalId = setTimeout(poll, POLLING_INTERVAL);
        } catch (error) {
          console.error("Error fetching members:", error);
          toast.error("Failed to update members");
          // При ошибке пробуем снова через RETRY_DELAY
          intervalId = setTimeout(poll, RETRY_DELAY);
        }
      };

      // Запускаем первый запрос
      await poll();
    } catch (error) {
      console.error("Error initializing polling:", error);
      toast.error("Failed to connect to server");
      isPolling = false;
      // Пробуем переподключиться через RETRY_DELAY
      setTimeout(startPolling, RETRY_DELAY);
    }
  };

  startPolling();

  return () => {
    subscriber = null;
    isPolling = false;
    if (intervalId) clearTimeout(intervalId);
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

interface Role {
  name: string;
  color: string | null;
  position: number;
}