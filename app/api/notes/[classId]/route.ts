import { NextResponse } from "next/server";
import {
  getClassNotes,
  createClassNote,
  deleteClassNote,
  updateClassNote,
} from "@/lib/classnotes";

type Params = {
  params: Promise<{ classId: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { classId } = await params;
  return NextResponse.json(await getClassNotes(classId));
}

export async function POST(req: Request, { params }: Params) {
  const { classId } = await params;
  const body = await req.json();

  return NextResponse.json(await createClassNote(classId, body.text));
}

export async function DELETE(req: Request, { params }: Params) {
  const { classId } = await params;
  const body = await req.json();

  return NextResponse.json(await deleteClassNote(classId, body.noteId));
}

export async function PATCH(req: Request, { params }: Params) {
  const { classId } = await params;
  const body = await req.json();

  return NextResponse.json(
    await updateClassNote(classId, body.noteId, body.text),
  );
}
