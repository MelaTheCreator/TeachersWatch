import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl text-center p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4">
          TeachersWatch
          <br />- das Orga-Tool für LehrerInnen
        </h1>

        <p className="text-gray-600 mb-6">
          Organisiere deinen Schulalltag einfach und übersichtlich.
        </p>
        <br />
        <ul className="text-left text-gray-700 mb-8 space-y-2">
          <li>📅 Kalender für Termine & Prüfungen</li>
          <li>💬 Chat für Kommunikation</li>
          <li>👨‍🏫 Klassen- & Schülerverwaltung</li>
          <li>📊 Noten & Durchschnitt automatisch berechnen</li>
          <li>📝 Notizen & Schülerinfos</li>
        </ul>
        <br />
        <Link
          href="/home"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Zur Anmeldung
        </Link>
      </div>
    </main>
  );
}
