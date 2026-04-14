import fs from "fs/promises";
import path from "path";

export type TimetableEntry = {
  name: string;
  teacher: string;
  room: string;
};

export type Timetable = Record<
  string,
  Record<string, Record<string, TimetableEntry>>
>;

const filePath = path.join(process.cwd(), "data", "timetable.json");

async function readFile(): Promise<Timetable> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    if (!data.trim()) return {};
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeFile(data: Timetable) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function getTimetable(classId: string) {
  const data = await readFile();
  return data[classId] || {};
}

export async function setTimetable(
  classId: string,
  timetable: Timetable[string],
) {
  const data = await readFile();

  data[classId] = timetable;

  await writeFile(data);
}
