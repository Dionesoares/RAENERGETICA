import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound } from "lucide-react";

export default function SetTechnicianAccessModal({ open, onOpenChange, technician, onSave }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleOpenChange = (value) => {
    if (!value) {
      setPassword("");
      setConfirm("");
      setError("");
    }
    onOpenChange(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setSaving(true);
    try {
      await onSave(password);
      handleOpenChange(false);
    } catch (err) {
      setError(err.message || "Não foi possível definir o acesso.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Liberar acesso do técnico</DialogTitle>
          <DialogDescription>
            Defina a senha de {technician?.name || "técnico"} para a área de suporte técnico.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div className="space-y-2">
            <Label>Nova senha</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Confirmar senha</Label>
            <Input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <Button type="submit" className="h-11 w-full" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><KeyRound className="mr-2 h-4 w-4" /> Salvar acesso</>}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
