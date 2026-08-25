import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip } from "lucide-react";
import { base44 } from "@/api/base44Client";

const empty = {
  name: "", email: "", phone: "", cpf: "", address: "", city: "", state: "",
  cnh: "", resume_url: "", courses: "", password: "", confirm_password: "",
};

export default function TechnicianModal({ open, onOpenChange, technician, onSave }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(technician ? { ...empty, ...technician } : empty);
  }, [technician, open]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm((f) => ({ ...f, resume_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!technician) {
      if ((form.password || "").length < 6) {
        alert("Defina uma senha de acesso com no mínimo 6 caracteres.");
        return;
      }
      if (form.password !== form.confirm_password) {
        alert("As senhas não coincidem.");
        return;
      }
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{technician ? "Editar Técnico" : "Novo Técnico"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="tech-name">Nome</Label>
              <Input id="tech-name" required value={form.name} onChange={set("name")} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="tech-email">E-mail de acesso</Label>
              <Input
                id="tech-email"
                type="email"
                required
                disabled={!!technician}
                value={form.email}
                onChange={set("email")}
              />
              {!technician && (
                <p className="text-xs text-muted-foreground">
                  Este e-mail e a senha abaixo liberam o acesso à área de suporte técnico.
                </p>
              )}
            </div>
            {!technician && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tech-password">Senha de acesso</Label>
                  <Input
                    id="tech-password"
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech-confirm">Confirmar senha</Label>
                  <Input
                    id="tech-confirm"
                    type="password"
                    required
                    minLength={6}
                    value={form.confirm_password}
                    onChange={set("confirm_password")}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="tech-phone">Telefone</Label>
              <Input id="tech-phone" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-cpf">CPF</Label>
              <Input id="tech-cpf" value={form.cpf} onChange={set("cpf")} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="tech-address">Endereço</Label>
              <Input id="tech-address" value={form.address} onChange={set("address")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-city">Cidade</Label>
              <Input id="tech-city" value={form.city} onChange={set("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-state">Estado</Label>
              <Input id="tech-state" value={form.state} onChange={set("state")} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="tech-cnh">CNH (número/categoria)</Label>
              <Input id="tech-cnh" value={form.cnh} onChange={set("cnh")} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="tech-courses">Cursos e capacitações</Label>
              <Textarea id="tech-courses" rows={3} value={form.courses} onChange={set("courses")} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="tech-resume">Currículo (arquivo)</Label>
              <div className="flex items-center gap-3">
                <Input id="tech-resume" type="file" onChange={handleFile} className="flex-1" />
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              {form.resume_url && !uploading && (
                <a
                  href={form.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Paperclip className="h-3 w-3" /> Ver arquivo enviado
                </a>
              )}
            </div>
          </div>
          <Button type="submit" className="h-11 w-full font-semibold" disabled={saving || uploading}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}