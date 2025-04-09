export interface DiscordMember {
    id: string;
    name: string;
    avatar: string | null;
    roles: { name: string; color: string | null; position: number }[];
    isBot: boolean;
    isOwner: boolean;
    joinedAt: string | null;
    status: { online: boolean; mic: boolean; sound: boolean };
  }