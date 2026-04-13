import fs from "fs/promises";
import path from "path";

export type ClassSubject = {
  name: string;
  teacher: string;
};

export type SchoolClass = {
  id: string;
  grade: string;
  students: string[];
  subjects: ClassSubject[];
};

const filePath = path.join(process.cwd(), "data", "classes.json");

/**
 * 📖 Klassen lesen
 */
export async function readClasses(): Promise<SchoolClass[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * 💾 speichern
 */
async function writeClasses(classes: SchoolClass[]) {
  await fs.writeFile(filePath, JSON.stringify(classes, null, 2));
}

/**
 * 🔍 einzelne Klasse holen
 */
export async function getClassById(classId: string) {
  const classes = await readClasses();
  return classes.find((c) => c.grade === classId) || null;
}

/**
 * ➕ Klasse erstellen
 */
export async function createClass(input: SchoolClass) {
  const classes = await readClasses();

  const newClass: SchoolClass = {
    id: input.grade,
    grade: input.grade,
    students: input.students ?? [],
    subjects: input.subjects ?? [],
  };

  classes.push(newClass);
  await writeClasses(classes);

  return newClass;
}

/**
 * ❌ Klasse löschen
 */
export async function deleteClass(classId: string) {
  const classes = await readClasses();

  const updated = classes.filter((c) => c.id !== classId);

  await writeClasses(updated);

  return updated;
}
