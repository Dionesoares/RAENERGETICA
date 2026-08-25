import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2, ShieldCheck, Wrench, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AdminForgotPasswordModal from "@/components/admin/AdminForgotPasswordModal";
import TecnicoForgotPasswordModal from "@/components/tecnico/TecnicoForgotPasswordModal";

export default function AdminLogin() {
  const [mode, setMode] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const isAdmin = mode === "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      const me = await base44.auth.me();

      if (isAdmin) {
        if (me.role !== "admin") {
          setError("Acesso restrito a administradores.");
          await base44.auth.logout();
          setLoading(false);
          return;
        }
        window.location.href = "/admin";
      } else {
        const technicians = await base44.entities.Technician.filter({ email: me.email });
        if (technicians.length === 0) {
          setError("Acesso restrito à equipe técnica.");
          await base44.auth.logout();
          setLoading(false);
          return;
        }
        window.location.href = "/tecnico";
      }
    } catch (err) {
      setError(err.message || "E-mail ou senha inválidos");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>

        {/* Toggle Admin / Técnico */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
          <button
            type="button"
            onClick={() => setMode("admin")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              isAdmin ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> Admin
          </button>
          <button
            type="button"
            onClick={() => setMode("tecnico")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              !isAdmin ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wrench className="h-4 w-4" /> Técnico
          </button>
        </div>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary/10">
            {isAdmin ? <ShieldCheck className="h-6 w-6 text-primary" /> : <Wrench className="h-6 w-6 text-primary" />}
          </div>
          <h1 className="text-xl font-bold text-primary">
            {isAdmin ? "Painel Administrativo" : "Área do Técnico"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin ? "Acesso restrito à equipe RA Energética" : "Acesso restrito à equipe técnica"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 pl-10"
                placeholder={isAdmin ? "admin@raenergetica.com.br" : "tecnico@raenergetica.com.br"}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button type="submit" className="h-11 w-full font-semibold" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </Button>
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="w-full text-center text-sm font-medium text-primary hover:text-accent"
          >
            Esqueci minha senha
          </button>
        </form>
      </div>

      {isAdmin ? (
        <AdminForgotPasswordModal
          open={forgotOpen}
          onOpenChange={setForgotOpen}
          redirectTo="/admin/login"
          title="Recuperar Senha"
          placeholder="admin@raenergetica.com.br"
        />
      ) : (
        <TecnicoForgotPasswordModal
          open={forgotOpen}
          onOpenChange={setForgotOpen}
        />
      )}
    </div>
  );
}