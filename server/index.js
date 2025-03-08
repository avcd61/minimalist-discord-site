import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['DISCORD_BOT_TOKEN', 'DISCORD_GUILD_ID', 'DISCORD_PUBLIC_TOKEN'];
const missingEnv = requiredEnv.filter(varName => !process.env[varName]);
if (missingEnv.length > 0) {
  console.error('Отсутствуют переменные окружения:', missingEnv);
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8080"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:8080"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const connectedClients = new Set();
let lastMemberData = null;

discord.once('ready', () => {
  console.log(`Успешно подключен к Discord как ${discord.user?.tag}`);
  console.log('Запускаю обновление участников...');
  updateMembers();
});

discord.on('error', (error) => {
  console.error('Ошибка клиента Discord:', error.message);
});

discord.on('debug', (info) => {
  console.log('Debug Discord:', info);
});

const updateInterval = setInterval(async () => {
  console.log('Выполняю обновление участников...');
  await updateMembers();
}, 5000);

async function updateMembers() {
  if (!discord.isReady()) {
    console.log('Клиент Discord не готов');
    return;
  }

  try {
    console.log('Получаю гильдию...');
    const guild = await discord.guilds.fetch(process.env.DISCORD_GUILD_ID);
    console.log(`Гильдия найдена: ${guild.name}`);
    
    console.log('Получаю участников...');
    const members = await guild.members.fetch({ withPresences: true });
    console.log(`Найдено участников: ${members.size}`);

    const memberData = Array.from(members.values()).map(member => ({
      id: member.id,
      name: member.displayName,
      avatar: member.user.displayAvatarURL(),
      roles: member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => ({
          name: role.name,
          color: role.hexColor // HEX-цвет роли
        })),
      isBot: member.user.bot,
      joinedAt: member.joinedAt?.toLocaleDateString(),
      status: {
        online: member.presence ? 
          (member.presence.status === 'online' || 
           member.presence.status === 'idle' || 
           member.presence.status === 'dnd') : 
          false, // Оффлайн или невидимка = false
        mic: member.voice ? 
          member.voice.selfMute === false : 
          false, // Микрофон выключен, если нет голосового состояния
        sound: member.voice ? 
          member.voice.selfDeaf === false : 
          false // Звук выключен, если нет голосового состояния
      }
    }));

    const currentDataString = JSON.stringify(memberData);
    if (currentDataString !== lastMemberData) {
      lastMemberData = currentDataString;
      console.log('Отправляю обновленные данные клиентам...');
      io.emit('members-update', memberData);
    } else {
      console.log('Данные не изменились, пропускаю отправку');
    }
  } catch (error) {
    console.error('Ошибка в updateMembers:', error.message);
    setTimeout(updateMembers, 1000);
  }
}

io.on('connection', (socket) => {
  console.log('Новый клиент подключен:', socket.id);
  connectedClients.add(socket);

  socket.on('error', (error) => {
    console.error('Ошибка сокета:', error.message);
  });

  socket.on('disconnect', () => {
    console.log('Клиент отключен:', socket.id);
    connectedClients.delete(socket);
  });
});

app.get('/api/members', async (req, res) => {
  const token = req.query.token;
  
  if (token !== process.env.DISCORD_PUBLIC_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (!discord.isReady()) {
    return res.status(503).json({ error: 'Discord client not ready' });
  }

  try {
    const guild = await discord.guilds.fetch(process.env.DISCORD_GUILD_ID);
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
    console.error('Error in /api/members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

app.get('/api/token', (req, res) => {
  console.log('Запрос токена от клиента');
  res.json({ token: process.env.DISCORD_PUBLIC_TOKEN });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

function cleanup() {
  console.log('Очистка ресурсов...');
  clearInterval(updateInterval);
  discord.destroy();
  httpServer.close();
  process.exit(0);
}

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

console.log('Попытка входа в Discord...');
discord.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => console.log('Успешная аутентификация в Discord'))
  .catch(error => {
    console.error('Ошибка входа в Discord:', error.message);
    process.exit(1);
  });