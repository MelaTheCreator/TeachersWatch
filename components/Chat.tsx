"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Message = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
};

export default function Chat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    const res = await fetch("/api/chat");
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // live refresh
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session?.user?.email,
        userName: session?.user?.name,
        text,
      }),
    });

    setText("");
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto border p-3 rounded bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-bold">{msg.userName}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <input
          className="border p-2 flex-1 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nachricht schreiben..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Senden
        </button>
      </div>
    </div>
  );
}
