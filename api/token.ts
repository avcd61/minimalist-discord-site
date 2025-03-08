import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse): void {
  // Настройка CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081"); // Разрешить только localhost:8081
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Обработка предварительного запроса OPTIONS
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const DISCORD_PUBLIC_TOKEN = process.env.DISCORD_PUBLIC_TOKEN ?? "BmvpakW88lwLinovHUpSPGq3c4ROM0Fa";
  res.status(200).json({ token: DISCORD_PUBLIC_TOKEN });
}