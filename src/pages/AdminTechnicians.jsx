import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, KeyRound } from "lucide-react";
import TechnicianModal from "@/components/admin/TechnicianModal";
import SetTechnicianAccessModal from "@/components/admin/SetTechnicianAccessModal";
import { waLinkTo } from "@/lib/whatsapp";
import { toast } from "@/components/ui/use-toast";

export default function AdminTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [accessFor, setAccessFor] = useState(null);

  const load = async () => {
    setTechnicians(await base44.entities.Technician.list("-created_date"));
  };

  useEffect(() => { load(); }, []);

  const sendTechnicianAccess = async ({ name, email, phone, password }) => {
    return base44.functions.invoke("sendTechnicianAccess", { name, email, phone, password });
  };

  const technicianPayload = (form) => {
    const { password, confirm_password, ...rest } = form;
    return {
      name: rest.name,
      email: String(rest.email || "").trim().toLowerCase(),
      phone: rest.phone,
      cpf: rest.cpf,
      address: rest.address,
      city: rest.city,
      state: rest.state,
      cnh: rest.cnh,
      resume_url: rest.resume_url,
      courses: rest.courses,
    };
  };

  const handleSave = async (form) => {
    const payload = technicianPayload(form);
    if (editing) {
      const { email, ...rest } = payload;
      await base44.entities.Technician.update(editing.id, rest);
    } else {
      await base44.entities.Technician.create(payload);
      const loginUrl = `${window.location.origin}/tecnico/login`;
      try {
        await sendTechnicianAccess({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          password: form.password,
        });
        toast({
          title: "Técnico cadastrado com acesso",
          description: `${payload.email} já pode entrar na área de suporte técnico.`,
        });
      } catch (err) {
        toast({
          title: "Técnico cadastrado, mas o acesso não foi criado",
          description: err.message || "Use o botão de chave para definir a senha.",
          variant: "destructive",
        });
      }
      if (form.phone) {
        const msg = `Olá ${form.name}! Você foi cadastrado como técnico da RA Energética. Acesse ${loginUrl} com o e-mail ${payload.email} e a senha definida pelo administrativo.`;
        window.open(waLinkTo(form.phone, msg), "_blank");
      }
    }
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleSetAccess = async (password) => {
    if (!accessFor) return;
    const loginUrl = `${window.location.origin}/tecnico/login`;
    await sendTechnicianAccess({
      name: accessFor.name,
      email: accessFor.email,
      phone: accessFor.phone,
      password,
    });
    toast({
      title: "Acesso liberado",
      description: `${accessFor.email} já pode entrar na área do técnico.`,
    });
    if (accessFor.phone) {
      const msg = `Olá ${accessFor.name}! Seu acesso de técnico da RA Energética foi atualizado. Entre em ${loginUrl} com o e-mail ${accessFor.email} e a nova senha.`;
      window.open(waLinkTo(accessFor.phone, msg), "_blank");
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
        <div>
          <h1 className="text-2xl font-bold text-primary">Técnicos</h1>
          <p className="text-sm text-muted-foreground">Cadastre a equipe e libere o acesso à área de suporte técnico.</p>
        </div>
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
                <button onClick={() => setAccessFor(t)} title="Definir senha de acesso" className="text-primary hover:text-accent">
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
                    <button onClick={() => setAccessFor(t)} title="Definir senha de acesso" className="mr-2 text-primary hover:text-accent">
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
      <SetTechnicianAccessModal
        open={!!accessFor}
        onOpenChange={(open) => !open && setAccessFor(null)}
        technician={accessFor}
        onSave={handleSetAccess}
      />
    </div>
  );
}