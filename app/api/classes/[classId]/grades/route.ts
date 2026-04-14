import { NextResponse } from "next/server";
import { readClasses } from "@/lib/classes";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "classes.json");

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params;

  const { studentId, subject, grade } = await req.json();

  const classes = await readClasses();

  const classIndex = classes.findIndex((c) => c.id === classId);
  if (classIndex === -1) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const student = classes[classIndex].students.find(
    (s: any) => s.id === studentId,
  );

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  if (!student.grades) student.grades = {};
  if (!student.grades[subject]) student.grades[subject] = [];

  student.grades[subject].push(Number(grade));

  await fs.writeFile(filePath, JSON.stringify(classes, null, 2));

  return NextResponse.json(classes[classIndex]);
}
