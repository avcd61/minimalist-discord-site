import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchMembers } from "./lib/discordBot.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Настройка CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081"); // Разрешить только localhost:8081
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Обработка предварительного запроса OPTIONS
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const token = req.query.token as string;
  const DISCORD_PUBLIC_TOKEN = process.env.DISCORD_PUBLIC_TOKEN ?? "BmvpakW88lwLinovHUpSPGq3c4ROM0Fa";

  if (token !== DISCORD_PUBLIC_TOKEN) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  try {
    const members = await fetchMembers();
    res.status(200).json({ event: "members-update", data: members });
  } catch (error) {
    console.error("Error in /api/members:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
}