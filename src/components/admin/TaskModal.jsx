import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";

const empty = {
  title: "",
  description: "",
  date: "",
  time: "",
  priority: "media",
  status: "pendente",
  technician_id: "none",
};

export default function TaskModal({ open, onOpenChange, task, onSave }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    base44.entities.Technician.list("name").then(setTechnicians);
  }, []);

  useEffect(() => {
    setForm(task ? { ...empty, ...task, technician_id: task.technician_id || "none" } : empty);
  }, [task, open]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const technician = technicians.find((item) => item.id === form.technician_id);
    await onSave({
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      priority: form.priority,
      status: form.status,
      technician_id: technician?.id || null,
      technician_email: technician?.email || null,
      kind: technician ? "chamado" : "tarefa",
    });
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{task?.id ? "Editar Tarefa" : "Nova Tarefa / Chamado"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label>Título</Label>
            <Input required value={form.title} onChange={set("title")} />
          </div>
          <div className="space-y-1">
            <Label>Descrição</Label>
            <Textarea rows={2} value={form.description} onChange={set("description")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Data</Label>
              <Input type="date" required value={form.date} onChange={set("date")} />
            </div>
            <div className="space-y-1">
              <Label>Hora</Label>
              <Input type="time" value={form.time} onChange={set("time")} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Técnico responsável</Label>
            <Select
              value={form.technician_id || "none"}
              onValueChange={(v) => setForm((f) => ({ ...f, technician_id: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Somente administrativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Somente administrativo</SelectItem>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Se escolher um técnico, o chamado aparece na área de suporte técnico.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
