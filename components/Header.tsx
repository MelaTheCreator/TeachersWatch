"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();

  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setShowAuth(null);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Fehler bei Registrierung");
      return;
    }

    alert("Registrierung erfolgreich");

    setShowAuth("login");
  }

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white border-b relative">
      {/* LEFT */}
      <div className="font-bold">TeachersWatch</div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {status === "loading" && (
          <p className="text-sm text-gray-500">Loading...</p>
        )}

        {/* NOT LOGGED IN */}
        {!session && status !== "loading" && (
          <>
            {/* BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setShowAuth(showAuth === "login" ? null : "login")
                }
                className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
              >
                Login
              </button>

              <button
                onClick={() =>
                  setShowAuth(showAuth === "register" ? null : "register")
                }
                className="bg-green-500 text-white px-3 py-1 text-sm rounded"
              >
                Register
              </button>
            </div>

            {/* DROPDOWN PANEL */}
            {showAuth && (
              <div className="absolute right-6 top-14 bg-white border shadow-lg p-4 rounded flex gap-2 z-50">
                {/* LOGIN */}
                {showAuth === "login" && (
                  <form
                    onSubmit={handleLogin}
                    className="flex gap-2 items-center"
                  >
                    <input
                      className="border px-2 py-1 text-sm"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                      className="border px-2 py-1 text-sm"
                      placeholder="Passwort"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="bg-blue-500 text-white px-3 py-1 text-sm rounded">
                      Login
                    </button>
                  </form>
                )}

                {/* REGISTER */}
                {showAuth === "register" && (
                  <form
                    onSubmit={handleRegister}
                    className="flex gap-2 items-center"
                  >
                    <input
                      className="border px-2 py-1 text-sm"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />

                    <input
                      className="border px-2 py-1 text-sm"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                      className="border px-2 py-1 text-sm"
                      placeholder="Passwort"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="bg-green-500 text-white px-3 py-1 text-sm rounded">
                      Register
                    </button>
                  </form>
                )}
              </div>
            )}
          </>
        )}

        {/* LOGGED IN */}
        {session && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-3 py-1 text-sm rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
