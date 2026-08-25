import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import AdminSidebar from "./AdminSidebar";
import Logo from "@/components/ra/Logo";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (user && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold text-primary">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta área é exclusiva para administradores.
          </p>
          <button
            onClick={() => logout()}
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}