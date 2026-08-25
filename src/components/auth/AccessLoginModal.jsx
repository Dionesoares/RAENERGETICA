import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2, ShieldCheck, Wrench, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { mapAuthError } from "@/lib/authErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Logo from "@/components/ra/Logo";
import AdminForgotPasswordModal from "@/components/admin/AdminForgotPasswordModal";
import TecnicoForgotPasswordModal from "@/components/tecnico/TecnicoForgotPasswordModal";

function LoginForm({ defaultMode = "admin", onSuccess, showBackLink = false }) {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  const [mode, setMode] = useState(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const isAdmin = mode === "admin";

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      const me = await checkUserAuth();

      if (isAdmin) {
        if (me?.role !== "admin") {
          setError("Acesso restrito a administradores.");
          await base44.auth.logout();
          await checkUserAuth();
          setLoading(false);
          return;
        }
        onSuccess?.();
        navigate("/admin", { replace: true });
        return;
      }

      if (me?.role !== "technician") {
        setError("Acesso restrito à equipe técnica cadastrada.");
        await base44.auth.logout();
        await checkUserAuth();
        setLoading(false);
        return;
      }
      onSuccess?.();
      navigate("/tecnico", { replace: true });
    } catch (err) {
      setError(mapAuthError(err.message));
      setLoading(false);
    }
  };

  return (
    <>
      {showBackLink && (
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>
      )}
      <div className="mb-5 flex justify-center">
        <Logo tiny />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
        <button
          type="button"
          onClick={() => setMode("admin")}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            isAdmin ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Administrativo
        </button>
        <button
          type="button"
          onClick={() => setMode("tecnico")}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            !isAdmin ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wrench className="h-4 w-4" /> Técnico
        </button>
      </div>

      <div className="mb-5 text-center">
        <h1 className="text-xl font-bold text-primary">
          {isAdmin ? "Painel Administrativo" : "Suporte Técnico"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAdmin
            ? "Dashboard, financeiro, clientes, contratos e equipe"
            : "Chamados, fotos do serviço e relatórios"}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="access-email">E-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="access-email"
              type="email"
              required
              autoFocus
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-10"
              placeholder={isAdmin ? "admin@raenergetica.com.br" : "tecnico@raenergetica.com.br"}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="access-password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="access-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pl-10 pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
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

      {isAdmin ? (
        <AdminForgotPasswordModal
          open={forgotOpen}
          onOpenChange={setForgotOpen}
          redirectTo="/admin/login"
          title="Recuperar Senha"
          placeholder="admin@raenergetica.com.br"
        />
      ) : (
        <TecnicoForgotPasswordModal open={forgotOpen} onOpenChange={setForgotOpen} />
      )}
    </>
  );
}

export default function AccessLoginModal({
  open,
  onOpenChange,
  defaultMode = "admin",
  asPage = false,
}) {
  if (asPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <LoginForm defaultMode={defaultMode} showBackLink />
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-8">
        <DialogTitle className="sr-only">Acesso ao painel</DialogTitle>
        <LoginForm defaultMode={defaultMode} onSuccess={() => onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  );
}
