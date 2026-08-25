import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Mail,
  Loader2,
  Wrench,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import TecnicoForgotPasswordModal from "@/components/tecnico/TecnicoForgotPasswordModal";

export default function TecnicoLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      const me = await base44.auth.me();
      const technicians = await base44.entities.Technician.filter({
        email: me.email,
      });
      if (technicians.length === 0) {
        setError("Acesso restrito à equipe técnica cadastrada.");
        await base44.auth.logout();
        setLoading(false);
        return;
      }
      window.location.href = "/tecnico";
    } catch (err) {
      setError(err.message || "E-mail ou senha inválidos");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-primary/10">
            <Wrench className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-primary">Área do Técnico</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesso restrito à equipe técnica
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tec-email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="tec-email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 pl-10"
                placeholder="tecnico@raenergetica.com.br"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tec-password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="tec-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pl-10 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="h-11 w-full font-semibold"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" /> Entrar
              </>
            )}
          </Button>
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="w-full text-center text-sm font-medium text-primary hover:text-accent"
          >
            Esqueci minha senha
          </button>
        </form>

        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            É administrador?{" "}
            <Link
              to="/admin/login"
              className="font-medium text-primary hover:underline"
            >
              Acessar painel administrativo
            </Link>
          </p>
        </div>
      </div>

      <TecnicoForgotPasswordModal
        open={forgotOpen}
        onOpenChange={setForgotOpen}
      />
    </div>
  );
}