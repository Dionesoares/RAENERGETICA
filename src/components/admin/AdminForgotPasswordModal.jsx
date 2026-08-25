import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";

export default function AdminForgotPasswordModal({
  open,
  onOpenChange,
  redirectTo = "/login",
  title = "Recuperar Senha",
  placeholder = "admin@raenergetica.com.br",
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.functions.invoke("sendPasswordResetLink", { email });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (v) => {
    if (!v) {
      setEmail("");
      setSent(false);
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="space-y-3">
            <p className="rounded-lg bg-accent/10 p-3 text-sm text-accent">
              Se este e-mail estiver cadastrado, você receberá o link para criar/redefinir sua senha (com confirmação).
            </p>
            <p className="text-xs text-muted-foreground">
              Verifique também a caixa de spam. Após definir a senha, você poderá acessar o sistema.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Informe seu e-mail para receber o link de criação/redefinição de senha.
            </p>
            <div className="space-y-2">
              <Label htmlFor="forgot-email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10"
                  placeholder={placeholder}
                />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full font-semibold" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar link de recuperação"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}