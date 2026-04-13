"use client";

import { useEffect, useState } from "react";

type News = {
  id: string;
  title: string;
  text: string;
  image?: string;
  createdAt: string;
  author: string;
};

export default function NewsSection({ session }: any) {
  const [news, setNews] = useState<News[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  // ✅ SAFE CHECK (wichtig!)
  const isAdmin = session?.user?.email === "mela@gmx.de";

  async function loadNews() {
    const res = await fetch("/api/news");
    const data = await res.json();
    setNews(data);
  }

  async function createNews() {
    const res = await fetch("/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, text, image }),
    });

    if (!res.ok) {
      console.error("CREATE NEWS FAILED");
      return;
    }

    setTitle("");
    setText("");
    setImage("");

    loadNews();
  }

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        {" "}
        <h1 className="text-4xl font-bold mb-10">
          Willkommen {session?.user?.name ?? ""}
        </h1>
        {/* ADMIN INPUT */}
        {isAdmin && (
          <div className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="font-bold">Neue News erstellen</h2>

            <input
              className="border p-2 w-full"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="border p-2 w-full"
              placeholder="Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <input
              className="border p-2 w-full"
              placeholder="Bild URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />

            <button
              onClick={createNews}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Absenden
            </button>
          </div>
        )}
        {/* NEWS LIST */}
        <div className="space-y-4">
          {news.map((n) => (
            <div key={n.id} className="bg-white p-4 rounded shadow">
              {n.image && (
                <div className="w-full h-56 overflow-hidden rounded mb-3">
                  <img src={n.image} className="w-full h-full object-cover" />
                </div>
              )}

              <h3 className="text-xl font-bold">{n.title}</h3>

              <p className="text-gray-600 text-sm mb-2">
                {new Date(n.createdAt).toLocaleString()} · {n.author}
              </p>

              <p>{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
