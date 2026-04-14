import fs from "fs/promises";
import path from "path";

export type Note = {
  id: string;
  text: string;
  createdAt: string;
};

type NotesMap = Record<string, Note[]>;

const filePath = path.join(process.cwd(), "data", "classnotes.json");

async function readFile(): Promise<NotesMap> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data.trim() ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

async function writeFile(data: NotesMap) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function getClassNotes(classId: string): Promise<Note[]> {
  const data = await readFile();
  return data[classId] ?? [];
}

export async function createClassNote(classId: string, text: string) {
  const data = await readFile();

  const newNote: Note = {
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  };

  if (!data[classId]) data[classId] = [];

  data[classId].push(newNote);
  await writeFile(data);

  return data[classId];
}

export async function deleteClassNote(classId: string, noteId: string) {
  const data = await readFile();

  data[classId] = data[classId]?.filter((n) => n.id !== noteId) ?? [];

  await writeFile(data);

  return data[classId];
}

export async function updateClassNote(
  classId: string,
  noteId: string,
  text: string,
) {
  const data = await readFile();

  data[classId] = (data[classId] ?? []).map((n) =>
    n.id === noteId ? { ...n, text } : n,
  );

  await writeFile(data);

  return data[classId];
}
