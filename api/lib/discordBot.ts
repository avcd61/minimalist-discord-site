import { IntentsBitField, Client, GuildMember } from "discord.js";
import type { DiscordMember } from "../types/discord.js";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID
  ? parseInt(process.env.DISCORD_GUILD_ID)
  : undefined;

if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
  throw new Error("DISCORD_BOT_TOKEN or DISCORD_GUILD_ID is not set in environment variables");
}

const intents = new IntentsBitField();
intents.add(
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildPresences,
  IntentsBitField.Flags.GuildVoiceStates
);

const bot = new Client({ intents });

const memberToDiscordMember = (member: GuildMember, ownerId: string): DiscordMember => ({
  id: member.id,
  name: member.displayName,
  avatar: member.user.avatarURL() ?? null,
  roles: member.roles.cache
    .filter((role) => role.name !== "@everyone")
    .map((role) => ({
      name: role.name,
      color: role.color ? `#${role.color.toString(16).padStart(6, "0")}` : null,
      position: role.position,
    })),
  isBot: member.user.bot,
  isOwner: member.id === ownerId,
  joinedAt: member.joinedAt ? member.joinedAt.toISOString() : null,
  status: {
    online: ["online", "idle", "dnd"].includes(member.presence?.status ?? "offline"),
    mic: member.voice?.selfMute !== true,
    sound: member.voice?.selfDeaf !== true,
  },
});

async function fetchMembers(): Promise<DiscordMember[]> {
  try {
    if (!bot.isReady()) {
      await bot.login(DISCORD_BOT_TOKEN);
      await new Promise((resolve) => bot.once("ready", resolve));
      console.log(`Logged in as ${bot.user?.tag} (ID: ${bot.user?.id})`);
    }

    const guild = bot.guilds.cache.get(DISCORD_GUILD_ID.toString()) ?? (await bot.guilds.fetch(DISCORD_GUILD_ID.toString()));
    if (!guild) throw new Error("Guild not found");

    const members = await guild.members.fetch();
    const ownerId = guild.ownerId;
    const memberData = members.map((member) => memberToDiscordMember(member, ownerId));

    return memberData;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  } finally {
    if (bot.isReady()) {
      await bot.destroy();
      console.log("Bot disconnected after request");
    }
  }
}

export { fetchMembers };