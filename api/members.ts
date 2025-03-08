import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client, GatewayIntentBits } from 'discord.js';

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ]
});

let isReady = false;

discord.once('ready', () => {
  console.log(`Logged in as ${discord.user?.tag}`);
  isReady = true;
});

// Подключаемся к Discord при первом запросе
let loginPromise: Promise<string | void> | null = null;

async function ensureDiscordConnection() {
  if (!loginPromise) {
    loginPromise = discord.login(process.env.DISCORD_BOT_TOKEN);
  }
  await loginPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.query.token as string;
  
  if (token !== process.env.DISCORD_PUBLIC_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    await ensureDiscordConnection();

    if (!isReady) {
      return res.status(503).json({ error: 'Discord client not ready' });
    }

    const guild = await discord.guilds.fetch(process.env.DISCORD_GUILD_ID as string);
    const members = await guild.members.fetch({ withPresences: true });
    
    const memberData = Array.from(members.values()).map(member => ({
      id: member.id,
      name: member.displayName,
      avatar: member.user.displayAvatarURL(),
      roles: member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => ({
          name: role.name,
          color: role.hexColor,
          position: role.position
        })),
      isBot: member.user.bot,
      isOwner: member.id === guild.ownerId,
      joinedAt: member.joinedAt?.toISOString(),
      status: {
        online: member.presence ? 
          ['online', 'idle', 'dnd'].includes(member.presence.status) : 
          false,
        mic: member.voice ? !member.voice.selfMute : false,
        sound: member.voice ? !member.voice.selfDeaf : false
      }
    }));

    res.json({ data: memberData });
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
}