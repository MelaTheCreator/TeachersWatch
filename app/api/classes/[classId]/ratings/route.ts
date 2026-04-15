import { NextResponse } from "next/server";
import { readClasses, writeClasses } from "@/lib/classes";

export async function PATCH(req: Request, context: any) {
  const { classId } = await context.params;

  const body = await req.json();

  const { studentId, category, field, value, teacherId, teacherName } = body;

  // 📖 Klassen laden
  const data = await readClasses();

  const classObj = data.find((c) => c.id === classId);

  if (!classObj) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const student = classObj.students.find((s) => s.id === studentId);

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // 🔥 Ratings Struktur initialisieren (robust & dynamisch)
  student.ratingsDetailed ??= {};
  student.ratingsDetailed[category] ??= {
    sozialverhalten: [],
    unterricht: [],
    pflichtbewusstsein: [],
    schulordnung: [],
  };

  // 🧾 neuer Eintrag
  const entry = {
    value,
    teacherId: teacherId ?? null,
    teacherName: teacherName ?? null,
    createdAt: new Date().toISOString(),
  };

  // 🔒 Safety check: field existiert wirklich
  if (!student.ratingsDetailed[category][field]) {
    student.ratingsDetailed[category][field] = [];
  }

  // ➕ speichern
  student.ratingsDetailed[category][field].push(entry);

  // 💾 persistieren
  await writeClasses(data);

  return NextResponse.json({
    success: true,
    entry,
  });
}
