import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import Logo from "@/components/ra/Logo";

export default function TecnicoLayout() {
  const { user, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isTechnician, setIsTechnician] = useState(false);

  useEffect(() => {
    if (!user) return;
    base44.entities.Technician.filter({ email: user.email }).then((list) => {
      setIsTechnician(list.length > 0);
      setChecking(false);
    });
  }, [user]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  if (!isTechnician) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold text-primary">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">Esta área é exclusiva para a equipe técnica.</p>
          <button onClick={() => logout()} className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-border bg-white p-4">
        <Logo compact />
        <button onClick={() => logout()} className="flex items-center gap-2 text-sm font-medium text-destructive hover:opacity-70">
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </header>
      <main className="mx-auto max-w-2xl p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}