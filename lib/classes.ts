import fs from "fs/promises";
import path from "path";

export type RatingEntry = {
  value: 1 | 2 | 3 | 4;
  teacherId: string;
  teacherName: string;
  createdAt: string;
};

export type RatingFieldKey =
  | "sozialverhalten"
  | "unterricht"
  | "pflichtbewusstsein"
  | "schulordnung";

export type RatingCategoryKey = "betragen";

export type RatingsDetailed = Record<
  RatingCategoryKey,
  Record<RatingFieldKey, RatingEntry[]>
>;

export type Student = {
  id: string;
  name: string;
  grades?: Record<string, number[]>;
  ratingsDetailed?: RatingsDetailed;
  passwords?: {
    service: string;
    password: string;
  }[];
};

export type ClassSubject = {
  name: string;
  teacher: string;
};

export type SchoolClass = {
  id: string;
  grade: string;
  students: Student[]; // ✅ WICHTIG FIX
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
export async function writeClasses(classes: SchoolClass[]) {
  await fs.writeFile(filePath, JSON.stringify(classes, null, 2));
}

/**
 * 🔍 einzelne Klasse holen
 */
export async function getClassById(classId: string) {
  const classes = await readClasses();
  return classes.find((c) => c.id === classId) || null;
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
