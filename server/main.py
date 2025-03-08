import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from discord import Intents
from discord.ext import commands
import asyncio
from dotenv import load_dotenv
import os
from typing import List, Optional
import json
from uvicorn.server import Server

load_dotenv()
DISCORD_BOT_TOKEN = os.getenv('DISCORD_BOT_TOKEN')
DISCORD_GUILD_ID = int(os.getenv('DISCORD_GUILD_ID'))
DISCORD_PUBLIC_TOKEN = os.getenv('DISCORD_PUBLIC_TOKEN', 'default_token')
PORT = int(os.getenv('PORT', 3001))

if not DISCORD_BOT_TOKEN or not DISCORD_GUILD_ID:
    raise ValueError("DISCORD_BOT_TOKEN или DISCORD_GUILD_ID не заданы в файле .env")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Role(BaseModel):
    name: str
    color: Optional[str] = None
    position: int

class MemberStatus(BaseModel):
    online: bool
    mic: bool
    sound: bool

class DiscordMember(BaseModel):
    id: str
    name: str
    avatar: Optional[str] = None
    roles: List[Role]
    isBot: bool
    isOwner: bool
    joinedAt: Optional[str] = None
    status: MemberStatus

intents = Intents.default()
intents.members = True
intents.presences = True
intents.voice_states = True
bot = commands.Bot(command_prefix='!', intents=intents)

last_member_data = None
connected_clients: set[WebSocket] = set()

@bot.event
async def on_ready():
    print(f'Успешно подключен к Discord как {bot.user} (ID: {bot.user.id})')
    guild = bot.get_guild(DISCORD_GUILD_ID)
    print(f"ID владельца сервера: {guild.owner_id}")
    asyncio.create_task(update_members())

async def get_current_members() -> List[dict]:
    if not bot.is_ready():
        await asyncio.sleep(1)
        return []

    try:
        guild = bot.get_guild(DISCORD_GUILD_ID)
        if not guild:
            guild = await bot.fetch_guild(DISCORD_GUILD_ID)
        print(f'Гильдия: {guild.name}, Owner ID: {guild.owner_id}')

        members = guild.members
        owner_id = guild.owner_id

        member_data = [
            DiscordMember(
                id=str(member.id),
                name=member.display_name,
                avatar=str(member.avatar.url) if member.avatar else None,
                roles=[
                    Role(
                        name=role.name,
                        color=f'#{role.color.value:06x}' if role.color.value else None,
                        position=role.position
                    )
                    for role in member.roles if role.name != '@everyone'
                ],
                isBot=member.bot,
                isOwner=member.id == owner_id,
                joinedAt=member.joined_at.strftime('%Y-%m-%d %H:%M:%S') if member.joined_at else None,
                status=MemberStatus(
                    online=member.status.name in ['online', 'idle', 'dnd'],
                    mic=not member.voice.self_mute if member.voice else False,
                    sound=not member.voice.self_deaf if member.voice else False
                )
            ).model_dump()  # Заменяем .dict() на .model_dump()
            for member in members
        ]
        for member in member_data:
            if member["isOwner"]:
                print(f"Владелец найден: {member['name']} (ID: {member['id']})")
        return member_data
    except Exception as e:
        print(f'Ошибка при получении участников: {str(e)}')
        return []

async def update_members():
    global last_member_data
    while True:
        if not bot.is_ready():
            await asyncio.sleep(1)
            continue
        try:
            member_data = await get_current_members()
            current_data_string = json.dumps(member_data)
            if current_data_string != last_member_data or last_member_data is None:
                last_member_data = current_data_string
                for client in connected_clients:
                    await client.send_json({'event': 'members-update', 'data': member_data})
        except Exception as e:
            print(f'Ошибка в update_members: {str(e)}')
        await asyncio.sleep(5)

@app.get('/api/token')
async def get_token():
    return JSONResponse(content={'token': DISCORD_PUBLIC_TOKEN})

@app.get('/api/members')
async def get_members():
    members = await get_current_members()
    return JSONResponse(content={'event': 'members-update', 'data': members})

@app.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    token = websocket.query_params.get('token')
    if token != DISCORD_PUBLIC_TOKEN:
        await websocket.close(code=1008, reason="Неверный токен")
        return
    
    member_data = await get_current_members()
    await websocket.send_json({'event': 'members-update', 'data': member_data})
    connected_clients.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == 'refresh-members':
                member_data = await get_current_members()
                await websocket.send_json({'event': 'members-update', 'data': member_data})
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

async def start_discord_bot():
    await bot.start(DISCORD_BOT_TOKEN)

async def start_uvicorn():
    config = uvicorn.Config(app, host='0.0.0.0', port=PORT)
    server = Server(config)
    await server.serve()

async def main():
    try:
        bot_task = asyncio.create_task(start_discord_bot())
        uvicorn_task = asyncio.create_task(start_uvicorn())
        await asyncio.gather(bot_task, uvicorn_task)
    except KeyboardInterrupt:
        await bot.close()

if __name__ == '__main__':
    asyncio.run(main())