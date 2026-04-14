"use client";

import { useSession } from "next-auth/react";
import Calendar from "@/components/Calendar";

export default function CalendarClient() {
  const { data: session } = useSession();

  if (!session) {
    return <p className="p-6">Bitte einloggen</p>;
  }

  return <Calendar />;
}
