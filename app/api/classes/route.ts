import { NextResponse } from "next/server";
import { readClasses, createClass, deleteClass } from "@/lib/classes";

/**
 * 📖 ALLE KLASSEN
 */
export async function GET() {
  const classes = await readClasses();
  return NextResponse.json(classes);
}

/**
 * ➕ KLASSE ERSTELLEN
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { grade, students, subjects } = body;

    if (!grade) {
      return NextResponse.json(
        { error: "Klassenstufe fehlt" },
        { status: 400 },
      );
    }

    const newClass = await createClass({
      id: grade,
      grade,
      students: students || [],
      subjects: subjects || [],
    });

    return NextResponse.json(newClass);
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Erstellen" },
      { status: 500 },
    );
  }
}

/**
 * ❌ KLASSE LÖSCHEN
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const { classId } = body;

    if (!classId) {
      return NextResponse.json({ error: "classId fehlt" }, { status: 400 });
    }

    const updated = await deleteClass(classId);

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
