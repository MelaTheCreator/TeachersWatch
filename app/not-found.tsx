"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000); // 3 Sekunden

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          Willkommen beim TeachersWatch
        </h1>
        <p className="text-gray-600">
          Du wirst automatisch zur Startseite weitergeleitet…
        </p>
      </div>
    </main>
  );
}
