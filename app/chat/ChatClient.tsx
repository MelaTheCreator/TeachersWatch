"use client";

import Chat from "@/components/Chat";
import { useSession } from "next-auth/react";

export default function ChatClient() {
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Bitte einloggen, um diese Seite zu sehen
        </h1>
      </div>
    );
  }

  return <Chat />;
}
