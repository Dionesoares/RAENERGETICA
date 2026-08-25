import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const empty = {
  type: "pf", name: "", trade_name: "", document: "", state_registration: "",
  contact_person: "", email: "", phone: "", address: "", city: "", state: "",
  zip_code: "", notes: "",
};

export default function ClientModal({ open, onOpenChange, client, onSave }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(client ? { ...empty, ...client } : empty);
  }, [client, open]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const isPj = form.type === "pj";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
        </DialogHeader>
        <Tabs value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pf">Pessoa Física</TabsTrigger>
            <TabsTrigger value="pj">Pessoa Jurídica</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label>{isPj ? "Razão Social" : "Nome Completo"}</Label>
            <Input required value={form.name} onChange={set("name")} />
          </div>
          {isPj && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Nome Fantasia</Label>
                <Input value={form.trade_name} onChange={set("trade_name")} />
              </div>
              <div className="space-y-1">
                <Label>Inscrição Estadual</Label>
                <Input value={form.state_registration} onChange={set("state_registration")} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>{isPj ? "CNPJ" : "CPF"}</Label>
              <Input value={form.document} onChange={set("document")} />
            </div>
            {isPj && (
              <div className="space-y-1">
                <Label>Responsável</Label>
                <Input value={form.contact_person} onChange={set("contact_person")} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>E-mail</Label>
              <Input type="email" value={form.email} onChange={set("email")} />
            </div>
            <div className="space-y-1">
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={set("phone")} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Endereço</Label>
            <Input value={form.address} onChange={set("address")} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Cidade</Label>
              <Input value={form.city} onChange={set("city")} />
            </div>
            <div className="space-y-1">
              <Label>Estado</Label>
              <Input value={form.state} onChange={set("state")} />
            </div>
            <div className="space-y-1">
              <Label>CEP</Label>
              <Input value={form.zip_code} onChange={set("zip_code")} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Observações</Label>
            <Textarea value={form.notes} onChange={set("notes")} rows={2} />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Salvando..." : "Salvar Cliente"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}