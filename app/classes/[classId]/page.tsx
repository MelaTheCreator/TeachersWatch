import { getClassById } from "@/lib/classes";
import ClassTabs from "@/components/ClassTabs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Props = {
  params: Promise<{
    classId: string;
  }>;
};

export default async function ClassDetailPage({ params }: Props) {
  const { classId } = await params;

  const schoolClass = await getClassById(classId);

  if (!schoolClass) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Klasse nicht gefunden</h1>
      </div>
    );
  }

  // 🔐 SESSION HOLEN
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Bitte einloggen, um diese Seite zu sehen
        </h1>
      </div>
    );
  }

  // 👑 ADMIN CHECK (wie bei News)
  const isAdmin = session?.user?.email === "mela@gmx.de";

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-4">Klasse {schoolClass.grade}</h2>

        <br />

        <h3 className="font-bold">SchülerInnen:</h3>

        <br />

        <ul className="space-y-1">
          {schoolClass.students
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name, "de"))
            .map((student) => (
              <li
                key={student.id}
                className="px-2 py-1 rounded hover:bg-gray-100"
              >
                {student.name}
              </li>
            ))}
        </ul>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">
        {/* 🔥 HIER FIX */}
        <ClassTabs schoolClass={schoolClass} isAdmin={isAdmin} />
      </main>
    </div>
  );
}
