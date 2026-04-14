import { NextResponse } from "next/server";
import { getTimetable, setTimetable } from "@/lib/timetable";

export async function GET(
  req: Request,
  context: { params: Promise<{ classId: string }> },
) {
  const { classId } = await context.params;

  const timetable = await getTimetable(classId);
  return NextResponse.json(timetable);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ classId: string }> },
) {
  const { classId } = await context.params;

  const body = await req.json();

  // body = kompletter neuer Stundenplan
  await setTimetable(classId, body);

  return NextResponse.json({ ok: true });
}
