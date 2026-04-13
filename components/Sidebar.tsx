"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session, status } = useSession();

  const isLoggedIn = !!session;

  // 👇 Sidebar komplett verstecken wenn nicht eingeloggt
  if (!isLoggedIn) return null;

  return (
    <aside className="w-64 bg-white border-r p-4 ">
      <nav className="flex flex-col gap-3 text-gray-700">
        <Link href="/home" className="hover:text-blue-500">
          🏠 Home
        </Link>

        <Link href="/chat" className="hover:text-blue-500">
          💬 Chat
        </Link>

        <Link href="/classes" className="hover:text-blue-500">
          📚 Klassen
        </Link>

        <Link href="/calendar" className="hover:text-blue-500">
          🗓️ Kalender
        </Link>
      </nav>
    </aside>
  );
}
