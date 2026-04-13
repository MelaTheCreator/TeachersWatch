import { getClassById } from "@/lib/classes";
import Link from "next/link";

type Props = {
  params: {
    classId: string;
  };
};

export default async function ClassDetailPage({ params }: Props) {
  const schoolClass = await getClassById(params.classId);

  if (!schoolClass) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Klasse nicht gefunden</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-4 space-y-4">
        {/* CLASS TITLE */}
        <h2 className="text-xl font-bold">Klasse {schoolClass.grade}</h2>

        {/* STUDENTS NAV */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Schüler</h3>

          <ul className="space-y-1">
            {schoolClass.students
              .sort((a, b) => a.localeCompare(b, "de"))
              .map((student) => (
                <li key={student}>
                  <Link
                    href={`/students/${encodeURIComponent(student)}`}
                    className="block px-2 py-1 rounded hover:bg-gray-100"
                  >
                    {student}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">{schoolClass.grade}</h1>

        <p className="text-gray-600">
          Hier kommt später Stundenplan, Fächer etc.
        </p>
      </div>
    </div>
  );
}
