import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, addMonths, subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MiniCalendar({ taskDates = [], selectedDate, onSelectDate }) {
  const [month, setMonth] = useState(new Date());

  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const days = [];
  let day = start;
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  const hasTask = (d) => taskDates.some((td) => isSameDay(new Date(td), d));

  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => setMonth((m) => subMonths(m, 1))} className="rounded-lg p-1 hover:bg-secondary">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold capitalize text-primary">
          {format(month, "MMMM yyyy", { locale: ptBR })}
        </span>
        <button onClick={() => setMonth((m) => addMonths(m, 1))} className="rounded-lg p-1 hover:bg-secondary">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => onSelectDate(d)}
            className={`relative rounded-lg py-1.5 text-xs transition-colors ${
              !isSameMonth(d, month) ? "text-muted-foreground/40" : "text-foreground"
            } ${isSameDay(d, selectedDate) ? "bg-primary text-white" : "hover:bg-secondary"}`}
          >
            {format(d, "d")}
            {hasTask(d) && <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />}
          </button>
        ))}
      </div>
    </div>
  );
}