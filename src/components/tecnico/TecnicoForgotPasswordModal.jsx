import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TecnicoForgotPasswordModal({ open, onOpenChange }) {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-primary/10">
            {sent ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <Mail className="h-6 w-6 text-primary" />
            )}
          </div>
          <DialogTitle className="text-center">
            {sent ? "Link enviado!" : "Recuperar Senha"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {sent
              ? "Verifique seu e-mail para criar sua nova senha."
              : "Informe seu e-mail cadastrado para receber o link de redefinição."}
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
              <p className="font-semibold">E-mail enviado com sucesso!</p>
              <p className="mt-1">
                Se este e-mail estiver cadastrado, você receberá o link para
                criar/redefinir sua senha (com confirmação).
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              <strong>Atenção:</strong> Verifique também a pasta de spam ou
              procurar. O e-mail oficial vem da plataforma Base44.
            </div>
            <div className="space-y-2">
              <a href="/tecnico/login" className="block">
                <Button className="h-11 w-full font-semibold">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o login
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tec-forgot-email">E-mail cadastrado</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="tec-forgot-email"
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
            <Button type="submit" className="h-11 w-full font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando link...
                </>
              ) : (
                "Enviar link de recuperação"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Após definir sua senha, você poderá acessar o Portal do Técnico.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}