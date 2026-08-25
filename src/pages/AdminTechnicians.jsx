import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, KeyRound } from "lucide-react";
import TechnicianModal from "@/components/admin/TechnicianModal";
import { waLinkTo } from "@/lib/whatsapp";
import { toast } from "@/components/ui/use-toast";

export default function AdminTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setTechnicians(await base44.entities.Technician.list("-created_date"));
  };

  useEffect(() => { load(); }, []);

  const sendTechnicianAccess = async (name, email, phone) => {
    await base44.functions.invoke("sendTechnicianAccess", { name, email, phone });
  };

  const handleSave = async (form) => {
    const { email, ...rest } = form;
    if (editing) {
      await base44.entities.Technician.update(editing.id, rest);
    } else {
      await base44.entities.Technician.create(form);
      const loginUrl = `${window.location.origin}/tecnico/login`;
      try {
        await sendTechnicianAccess(form.name, form.email, form.phone);
        toast({ title: "Técnico cadastrado", description: `Link de acesso enviado para ${form.email}.` });
      } catch (err) {
        toast({
          title: "Técnico cadastrado, mas falha no envio do e-mail",
          description: err.message || "Use o botão de senha para reenviar.",
          variant: "destructive",
        });
      }
      if (form.phone) {
        const msg = `Olá ${form.name}! Você foi cadastrado como técnico da RA Energética. Enviamos e-mails para ${form.email} com o link para criar sua senha (com confirmação) - procure pelo e-mail de "redefinição de senha" ou "convite". Abra o e-mail, clique no link, defina e confirme sua senha. Depois acesse: ${loginUrl}`;
        window.open(waLinkTo(form.phone, msg), "_blank");
      }
    }
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleSendPassword = async (t) => {
    const loginUrl = `${window.location.origin}/tecnico/login`;
    try {
      await sendTechnicianAccess(t.name, t.email, t.phone);
      toast({ title: "Link enviado", description: `E-mail enviado para ${t.email} com o link para criar a senha.` });
    } catch (err) {
      toast({
        title: "Não foi possível enviar o e-mail",
        description: err.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }
    if (t.phone) {
      const msg = `Olá ${t.name}! Enviamos e-mails para ${t.email} com o link para criar sua senha (com confirmação) - procure pelo e-mail de "redefinição de senha" ou "convite". Abra o e-mail, clique no link, defina e confirme sua senha. Depois acesse: ${loginUrl}`;
      window.open(waLinkTo(t.phone, msg), "_blank");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Excluir este técnico?")) return;
    await base44.entities.Technician.delete(id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Técnicos</h1>
        <Button size="lg" className="h-14 px-8 text-base" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus className="mr-2 h-5 w-5" /> Novo Técnico
        </Button>
      </div>

      {technicians.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Nenhum técnico cadastrado.</p>
      )}

      {/* Mobile cards */}
      {technicians.length > 0 && (
        <div className="space-y-3 lg:hidden">
          {technicians.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-white p-4">
              <p className="font-medium">{t.name}</p>
              <p className="break-words text-sm text-muted-foreground">{t.email}</p>
              <p className="text-sm text-muted-foreground">{t.phone || "-"}</p>
              <div className="mt-3 flex gap-3">
                <button onClick={() => { setEditing(t); setModalOpen(true); }} className="text-primary hover:text-accent">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleSendPassword(t)} title="Enviar senha" className="text-primary hover:text-accent">
                  <KeyRound className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-destructive hover:opacity-70">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop table */}
      {technicians.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-white lg:block">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {technicians.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.phone || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(t); setModalOpen(true); }} title="Editar" className="mr-2 text-primary hover:text-accent">
                      <Pencil className="inline h-4 w-4" />
                    </button>
                    <button onClick={() => handleSendPassword(t)} title="Enviar senha" className="mr-2 text-primary hover:text-accent">
                      <KeyRound className="inline h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="text-destructive hover:opacity-70">
                      <Trash2 className="inline h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TechnicianModal open={modalOpen} onOpenChange={setModalOpen} technician={editing} onSave={handleSave} />
    </div>
  );
}