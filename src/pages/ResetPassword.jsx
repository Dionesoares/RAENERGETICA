import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertTriangle, Wrench, ShieldCheck } from "lucide-react";

export default function ResetPassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get("token");

  const [ready, setReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(Boolean(resetToken));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!supabase) {
        setReady(true);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (active) {
        setHasRecoverySession(Boolean(session) || Boolean(resetToken));
        setReady(true);
      }
    };
    load();

    if (!supabase) return undefined;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasRecoverySession(true);
        setReady(true);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [resetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.resetPassword({ resetToken, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Falha ao redefinir a senha. O link pode ter expirado.");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasRecoverySession) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-50">
            <AlertTriangle className="h-7 w-7 text-amber-500" />
          </div>
          <h1 className="text-lg font-bold text-foreground">Link inválido</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Este link de redefinição está ausente ou é inválido.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-50">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <h1 className="text-lg font-bold text-foreground">Senha criada com sucesso!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua senha foi definida. Agora você pode acessar o sistema.
          </p>
          <div className="mt-6 space-y-3">
            <a href="/tecnico/login" className="block">
              <Button variant="default" className="h-12 w-full font-medium">
                <Wrench className="mr-2 h-4 w-4" /> Área do Técnico
              </Button>
            </a>
            <a href="/admin/login" className="block">
              <Button variant="outline" className="h-12 w-full font-medium">
                <ShieldCheck className="mr-2 h-4 w-4" /> Painel Administrativo
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">Nova senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="****"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 border-transparent bg-secondary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-muted-foreground">Repetir</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="****"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 border-transparent bg-secondary"
              required
            />
          </div>
          <Button type="submit" className="h-12 w-full font-medium" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar"}
          </Button>
        </form>
      </div>
    </div>
  );
}