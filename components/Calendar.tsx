"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
};

const daysOfWeek = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchEvents = async () => {
    const res = await fetch("/api/calendar");
    setEvents(await res.json());
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Mo = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: startDay + daysInMonth }, (_, i) => {
    if (i < startDay) return null;
    return new Date(year, month, i - startDay + 1);
  });

  const addEvent = async () => {
    if (!title || !startDate || !endDate) return;

    await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        startDate,
        endDate,
      }),
    });

    setTitle("");
    setStartDate("");
    setEndDate("");
    setSelectedDate(null);
    fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    await fetch("/api/calendar", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchEvents();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
          ‹
        </button>

        <h1 className="text-xl font-bold">
          {currentDate.toLocaleString("de-DE", {
            month: "long",
            year: "numeric",
          })}
        </h1>

        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
          ›
        </button>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2 min-w-250 ">
        {daysOfWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Kalender */}
      <div className="grid grid-cols-7 gap-2 ">
        {days.map((date, i) => {
          if (!date) return <div key={i} />;

          const iso = date.toISOString().split("T")[0];
          const dayEvents = events.filter(
            (e) => iso >= e.startDate && iso <= e.endDate,
          );

          return (
            <div
              key={i}
              className="border rounded p-1 min-h-25 text-sm cursor-pointer bg-white "
              onClick={() => {
                setSelectedDate(iso);
                setStartDate(iso);
                setEndDate(iso);
              }}
            >
              <div className="font-bold mb-1">{date.getDate()}</div>

              {dayEvents.map((e) => (
                <div
                  key={e.id}
                  className="bg-blue-100 rounded px-1 mb-1 flex justify-between items-center"
                >
                  <span className="truncate">{e.title}</span>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      deleteEvent(e.id);
                    }}
                    className="text-red-500 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-80">
            <h2 className="font-bold mb-2">Neuer Termin</h2>

            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedDate(null)}>Abbrechen</button>
              <button
                onClick={addEvent}
                className="bg-blue-500 text-white px-3 rounded"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
