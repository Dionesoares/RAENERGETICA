import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/lib/supabaseClient";

export default function QuoteBell() {
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const data = await base44.entities.QuoteRequest.list("-created_date");
    setRequests(data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 20000);
    if (!supabase) return () => clearInterval(interval);

    const channel = supabase
      .channel("quote_requests_bell")
      .on("postgres_changes", { event: "*", schema: "public", table: "quote_requests" }, load)
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const unread = requests.filter((item) => item.status === "nova");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-border text-primary hover:bg-secondary"
        aria-label="Notificações de orçamento"
      >
        <Bell className="h-5 w-5" />
        {unread.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#E3231C] px-1 text-[10px] font-bold text-white">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">Solicitações de orçamento</p>
            <Link to="/admin/orcamentos" onClick={() => setOpen(false)} className="text-xs font-semibold text-accent hover:underline">
              Ver todas
            </Link>
          </div>
          {unread.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Nenhuma solicitação nova.</p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              {unread.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <Link
                    to="/admin/orcamentos"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl bg-secondary/70 px-3 py-2 hover:bg-secondary"
                  >
                    <p className="text-sm font-medium text-primary">{item.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.generator}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {item.created_date ? format(new Date(item.created_date), "dd/MM/yyyy HH:mm") : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
