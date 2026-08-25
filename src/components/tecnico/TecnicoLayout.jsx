import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import TecnicoSidebar from "./TecnicoSidebar";
import Logo from "@/components/ra/Logo";

export default function TecnicoLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TecnicoSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-white p-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-border p-2 text-foreground/70 hover:bg-secondary"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo tiny />
        </header>
        <main className="flex-1 overflow-x-hidden p-4 sm:p-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
