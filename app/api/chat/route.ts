import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "messages.json");

// GET messages
export async function GET() {
  const data = await fs.readFile(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

// POST message
export async function POST(req: Request) {
  const body = await req.json();

  const data = await fs.readFile(filePath, "utf-8");
  const messages = JSON.parse(data);

  const newMessage = {
    id: crypto.randomUUID(),
    userId: body.userId,
    userName: body.userName,
    text: body.text,
    createdAt: Date.now(),
  };

  messages.push(newMessage);

  await fs.writeFile(filePath, JSON.stringify(messages, null, 2));

  return NextResponse.json(newMessage);
}
