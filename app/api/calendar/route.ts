import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "events.json");

// GET – alle Termine
export async function GET() {
  const data = await fs.readFile(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

// POST – neuen Termin anlegen
export async function POST(req: Request) {
  const body = await req.json();
  const data = await fs.readFile(filePath, "utf-8");
  const events = JSON.parse(data);

  const newEvent = {
    id: crypto.randomUUID(),
    title: body.title,
    startDate: body.startDate,
    endDate: body.endDate,
  };

  events.push(newEvent);

  await fs.writeFile(filePath, JSON.stringify(events, null, 2));
  return NextResponse.json(newEvent);
}
// PUT – Termin bearbeiten
export async function PUT(req: Request) {
  const body = await req.json();
  const data = await fs.readFile(filePath, "utf-8");
  const events = JSON.parse(data);

  const index = events.findIndex((e: any) => e.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  events[index] = { ...events[index], ...body };

  await fs.writeFile(filePath, JSON.stringify(events, null, 2));
  return NextResponse.json(events[index]);
}

// DELETE – Termin löschen
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const data = await fs.readFile(filePath, "utf-8");
  const events = JSON.parse(data);

  const filtered = events.filter((e: any) => e.id !== id);

  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));
  return NextResponse.json({ success: true });
}
