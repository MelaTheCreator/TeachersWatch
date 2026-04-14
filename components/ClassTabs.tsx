"use client";

import { useEffect, useState } from "react";

/* =========================
   TYPES
========================= */

export type Student = {
  id: string;
  name: string;
  grades?: Record<string, number[]>;
  ratings?: {
    sozialverhalten: string;
    arbeitsverhalten: string;
    bemerkung?: string;
  };
  passwords?: {
    service: string;
    password: string;
  }[];
};

type Subject = {
  name: string;
  teacher: string;
};

type Note = {
  id: string;
  text: string;
  createdAt: string;
};

type SchoolClass = {
  id: string;
  grade: string;
  students: Student[];
  subjects: Subject[];
};

type Tab =
  | "stundenplan"
  | "faecher"
  | "lehrer"
  | "noten"
  | "bewertungen"
  | "passwörter"
  | "notizen";

type TimetableEntry = {
  name: string;
  teacher: string;
  room: string;
};

/* =========================
   CONSTANTS
========================= */

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

const TIMES = [
  "08:00 - 08:45",
  "08:45 - 09:30",
  "09:50 - 10:35",
  "10:35 - 11:20",
  "11:35 - 12:20",
];

/* =========================
   COMPONENT
========================= */

export default function ClassTabs({
  schoolClass,
  isAdmin,
}: {
  schoolClass: SchoolClass;
  isAdmin: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("stundenplan");

  // ✅ FIX: lokale Kopie der Klasse (WICHTIG!)
  const [localClass, setLocalClass] = useState(schoolClass);

  const [timetable, setTimetable] = useState<
    Record<string, Record<string, TimetableEntry>>
  >({});

  const [timetableEdit, setTimetableEdit] = useState<typeof timetable>({});
  const [editMode, setEditMode] = useState(false);

  /* =========================
     NOTES (FIXED TYPE)
  ========================= */

  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState("");

  /* =========================
     LOAD TIMETABLE
  ========================= */

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/timetable/${schoolClass.id}`);
      const data = await res.json();

      setTimetable(data);
      setTimetableEdit(data);
    }

    load();
  }, [schoolClass.id]);

  /* =========================
     LOAD NOTES
  ========================= */

  useEffect(() => {
    if (activeTab !== "notizen") return;

    fetch(`/api/notes/${schoolClass.id}`)
      .then((res) => res.json())
      .then(setNotes);
  }, [activeTab, schoolClass.id]);

  /* =========================
     TIMETABLE UPDATE
  ========================= */

  function updateCell(
    day: string,
    rowIndex: number,
    field: keyof TimetableEntry,
    value: string,
  ) {
    setTimetableEdit((prev) => {
      const updated = { ...prev };

      if (!updated[day]) updated[day] = {};

      if (!updated[day][rowIndex]) {
        updated[day][rowIndex] = {
          name: "",
          teacher: "",
          room: "",
        };
      }

      updated[day][rowIndex][field] = value;

      return { ...updated };
    });
  }

  async function saveTimetable() {
    await fetch(`/api/timetable/${schoolClass.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(timetableEdit),
    });

    setTimetable(timetableEdit);
    setEditMode(false);
  }

  /* =========================
     NOTES ACTIONS
  ========================= */

  async function createNote() {
    if (!noteInput.trim()) return;

    const res = await fetch(`/api/notes/${schoolClass.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: noteInput }),
    });

    const data = await res.json();
    setNotes(data);
    setNoteInput("");
  }

  /* =========================
     GRADES
  ========================= */

  function formatGrades(grades?: number[]) {
    if (!grades || grades.length === 0) return "—";
    return grades.join(", ");
  }

  function calcAvg(grades: number[]) {
    if (!grades.length) return "-";
    return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
  }
  /* =========================
     UI
  ========================= */

  function tabButton(label: string, value: Tab) {
    return (
      <button
        onClick={() => setActiveTab(value)}
        className={`px-4 py-2 rounded font-medium ${
          activeTab === value
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div>
      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabButton("Stundenplan", "stundenplan")}
        {tabButton("Fächer", "faecher")}
        {tabButton("LehrerInnen", "lehrer")}
        {tabButton("Noten", "noten")}
        {tabButton("Bewertungen", "bewertungen")}
        {tabButton("Passwörter", "passwörter")}
        {tabButton("Notizen", "notizen")}
      </div>

      {/* CONTENT */}
      <div className="bg-white p-4 rounded shadow">
        {/* =========================
            STUNDENPLAN
        ========================= */}

        {activeTab === "stundenplan" && (
          <>
            {isAdmin && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  {editMode ? "Edit beenden" : "Editieren"}
                </button>

                {editMode && (
                  <button
                    onClick={saveTimetable}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Speichern
                  </button>
                )}
              </div>
            )}

            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "120px repeat(5, 1fr)" }}
            >
              <div></div>

              {DAYS.map((d) => (
                <div key={d} className="font-bold text-center">
                  {d}
                </div>
              ))}

              {TIMES.map((time, rowIndex) => (
                <div key={time} className="contents">
                  <div className="text-xs text-gray-500">{time}</div>

                  {DAYS.map((day) => {
                    const entry = timetableEdit?.[day]?.[rowIndex];

                    return (
                      <div
                        key={`${day}-${rowIndex}`}
                        className="border p-2 text-xs"
                      >
                        {editMode && isAdmin ? (
                          <div className="space-y-1">
                            <input
                              value={entry?.name || ""}
                              onChange={(e) =>
                                updateCell(
                                  day,
                                  rowIndex,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full border"
                            />

                            <input
                              value={entry?.teacher || ""}
                              onChange={(e) =>
                                updateCell(
                                  day,
                                  rowIndex,
                                  "teacher",
                                  e.target.value,
                                )
                              }
                              className="w-full border"
                            />

                            <input
                              value={entry?.room || ""}
                              onChange={(e) =>
                                updateCell(
                                  day,
                                  rowIndex,
                                  "room",
                                  e.target.value,
                                )
                              }
                              className="w-full border"
                            />
                          </div>
                        ) : (
                          <>
                            {entry ? (
                              <>
                                <div className="font-semibold">
                                  {entry.name}
                                </div>
                                <div>{entry.teacher}</div>
                                <div className="text-gray-400">
                                  {entry.room}
                                </div>
                              </>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}

        {/* =========================
            FAECHER
        ========================= */}

        {activeTab === "faecher" && (
          <ul className="space-y-2">
            {schoolClass.subjects.map((s) => (
              <li key={s.name} className="flex justify-between border-b pb-1">
                <span>{s.name}</span>
                <span className="text-gray-600">{s.teacher}</span>
              </li>
            ))}
          </ul>
        )}

        {/* =========================
            LEHRER
        ========================= */}

        {activeTab === "lehrer" && (
          <ul className="space-y-2">
            {schoolClass.subjects.map((s) => (
              <li key={s.name}>{s.teacher}</li>
            ))}
          </ul>
        )}

        {/* =========================
            NOTEN
        ========================= */}

        {activeTab === "noten" && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              {/* HEADER */}
              <thead>
                <tr>
                  <th className="border p-2 text-left bg-gray-100">Schüler</th>

                  {schoolClass.subjects.map((subject) => (
                    <th key={subject.name} className="border p-2 bg-gray-100">
                      {subject.name}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {schoolClass.students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    {/* NAME */}
                    <td className="border p-2 font-medium">{student.name}</td>

                    {/* FÄCHER */}
                    {schoolClass.subjects.map((subject) => {
                      const grades = student.grades?.[subject.name] ?? [];

                      const avg =
                        grades.length > 0
                          ? (
                              grades.reduce((a, b) => a + b, 0) / grades.length
                            ).toFixed(2)
                          : "—";

                      function formatGrades(arr: number[]) {
                        return arr.length ? arr.join(", ") : "—";
                      }

                      return (
                        <td
                          key={student.id + subject.name}
                          className="border p-2 cursor-pointer align-top"
                          onClick={async () => {
                            const input = prompt(
                              `Neue Note für ${student.name} in ${subject.name}`,
                            );

                            if (!input) return;

                            const newGrade = Number(input);
                            if (isNaN(newGrade)) return;

                            // 🔹 IMMUTABLE UPDATE (wichtig!)
                            const updatedStudents = schoolClass.students.map(
                              (s) => {
                                if (s.id !== student.id) return s;

                                const current = s.grades?.[subject.name] ?? [];

                                return {
                                  ...s,
                                  grades: {
                                    ...s.grades,
                                    [subject.name]: [...current, newGrade],
                                  },
                                };
                              },
                            );

                            await fetch(
                              `/api/classes/${schoolClass.id}/grades`,
                              {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  studentId: student.id,
                                  subject: subject.name,
                                  grade: newGrade,
                                }),
                              },
                            );
                          }}
                        >
                          <div className="space-y-1">
                            {/* NOTEN */}
                            <div>{formatGrades(grades)}</div>

                            {/* DURCHSCHNITT PRO SCHÜLER + FACH */}
                            <div className="text-xs text-gray-500">⌀ {avg}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* =========================
            PASSWÖRTER
        ========================= */}

        {activeTab === "passwörter" && (
          <div className="flex flex-wrap gap-10 max-w-200">
            {schoolClass.students.map((student) => (
              <div
                key={student.id}
                className="border rounded p-3 bg-gray-50 min-w-60"
              >
                {/* NAME */}
                <div className="font-bold mb-2">{student.name}</div>

                {/* PASSWORDS */}
                {student.passwords && student.passwords.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {student.passwords.map((pw, index) => (
                      <li
                        key={student.id + index}
                        className="flex justify-between border-b pb-1"
                      >
                        <span className="text-gray-600">{pw.service}</span>

                        <span className="font-mono">{pw.password}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400 text-sm">
                    Keine Passwörter hinterlegt
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* =========================
            NOTIZEN
        ========================= */}

        {activeTab === "notizen" && (
          <div className="space-y-3">
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full border p-2"
              placeholder="Neue Notiz..."
            />

            <button
              onClick={createNote}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Speichern
            </button>

            {notes.map((note) => (
              <div key={note.id} className="border p-2 rounded">
                <div className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleString()}
                </div>
                <div>{note.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
