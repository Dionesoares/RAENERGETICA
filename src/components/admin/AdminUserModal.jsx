import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const empty = { name: "", email: "", password: "", confirm_password: "" };

export default function AdminUserModal({ open, onOpenChange, user, onSave }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(user ? { ...empty, name: user.full_name || user.name || "", email: user.email || "" } : empty);
    setError("");
  }, [user, open]);

  const set = (field) => (e) => setForm((current) => ({ ...current, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user && (form.password || "").length < 6) {
      setError("Defina uma senha com no mínimo 6 caracteres.");
      return;
    }
    if (form.password && form.password !== form.confirm_password) {
      setError("As senhas não coincidem.");
      return;
    }
    if (user && form.password && form.password.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message || "Não foi possível salvar o usuário.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Atualizar administrador" : "Cadastrar usuário"}</DialogTitle>
          <DialogDescription>
            Quem for cadastrado aqui entra no painel administrativo com e-mail e senha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input required value={form.name} onChange={set("name")} />
          </div>
          <div className="space-y-1">
            <Label>E-mail de acesso</Label>
            <Input required type="email" disabled={!!user} value={form.email} onChange={set("email")} />
          </div>
          <div className="space-y-1">
            <Label>{user ? "Nova senha (opcional)" : "Senha"}</Label>
            <Input
              type="password"
              required={!user}
              minLength={user ? undefined : 6}
              value={form.password}
              onChange={set("password")}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="space-y-1">
            <Label>Confirmar senha</Label>
            <Input
              type="password"
              required={!user || !!form.password}
              value={form.confirm_password}
              onChange={set("confirm_password")}
            />
          </div>
          <Button type="submit" className="h-11 w-full" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar acesso"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
