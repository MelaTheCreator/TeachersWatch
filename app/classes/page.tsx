"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Student = string;

type Subject = {
  name: string;
  teacher: string;
};

type SchoolClass = {
  id: string;
  grade: string;
  students: Student[];
  subjects: Subject[];
};

const DEFAULT_SUBJECTS = [
  "Deutsch",
  "Mathematik",
  "Sachunterricht",
  "Musik",
  "Kunst",
  "Sport",
  "Religion / Ethik",
  "Englisch",
];

export default function ClassesPage() {
  const { data: session } = useSession();

  const isAdmin = session?.user?.email === "mela@gmx.de";

  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [grade, setGrade] = useState("");

  const [students, setStudents] = useState<string[]>([]);
  const [newStudent, setNewStudent] = useState("");

  const [subjects, setSubjects] = useState<Subject[]>(
    DEFAULT_SUBJECTS.map((name) => ({
      name,
      teacher: "",
    })),
  );

  async function loadClasses() {
    const res = await fetch("/api/classes");
    const data = await res.json();
    setClasses(data);
  }

  function addStudent() {
    if (!newStudent.trim()) return;

    const updated = [...students, newStudent.trim()]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "de"));

    setStudents(updated);
    setNewStudent("");
  }

  function removeStudent(name: string) {
    setStudents(students.filter((s) => s !== name));
  }

  function updateTeacher(subjectName: string, teacher: string) {
    setSubjects((prev) =>
      prev.map((s) => (s.name === subjectName ? { ...s, teacher } : s)),
    );
  }

  async function createClass() {
    if (!grade) return;

    const res = await fetch("/api/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grade,
        students,
        subjects,
      }),
    });

    if (!res.ok) {
      alert("Fehler beim Erstellen der Klasse");
      return;
    }

    setGrade("");
    setStudents([]);
    setSubjects(
      DEFAULT_SUBJECTS.map((name) => ({
        name,
        teacher: "",
      })),
    );

    loadClasses();
  }

  useEffect(() => {
    loadClasses();
  }, []);

  // 🚀 DELETE FUNCTION (NEU)
  async function handleDelete(classId: string) {
    const res = await fetch("/api/classes", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classId }),
    });

    if (!res.ok) {
      alert("Fehler beim Löschen");
      return;
    }

    loadClasses();
  }
  if (!session) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Bitte einloggen, um diese Seite zu sehen
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl flex gap-20 flex-wrap">
      {/* ADMIN FORM */}
      {isAdmin && (
        <div className="mb-8 bg-white p-4 rounded shadow space-y-4">
          <h2 className="font-semibold text-lg">Neue Klasse erstellen</h2>

          <input
            className="border p-2 w-full"
            placeholder="Klassenstufe (z.B. 1a)"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />

          <div>
            <h3 className="font-semibold mb-2">Schüler</h3>

            <div className="flex gap-2">
              <input
                className="border p-2 flex-1"
                placeholder="Name eingeben"
                value={newStudent}
                onChange={(e) => setNewStudent(e.target.value)}
              />
              <button
                onClick={addStudent}
                className="bg-green-500 text-white px-3 rounded"
              >
                +
              </button>
            </div>

            <ul className="mt-3 space-y-1">
              {students.map((s) => (
                <li
                  key={s}
                  className="flex justify-between bg-gray-100 p-2 rounded"
                >
                  {s}
                  <button
                    onClick={() => removeStudent(s)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Fächer</h3>

            <div className="space-y-2">
              {subjects.map((subj) => (
                <div key={subj.name} className="flex items-center gap-2">
                  <div className="w-40 font-medium">{subj.name}</div>

                  <input
                    className="border p-1 flex-1"
                    placeholder="Lehrer eintragen"
                    value={subj.teacher}
                    onChange={(e) => updateTeacher(subj.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={createClass}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Klasse erstellen
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold mb-6">Klassen</h1>
        {classes.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between bg-white p-4 rounded shadow"
          >
            <Link href={`/classes/${c.grade}`}>
              <div className="font-bold text-lg">{c.grade}</div>
            </Link>

            {isAdmin && (
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
