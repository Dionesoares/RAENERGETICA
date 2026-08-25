import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, FileSignature, Plus } from "lucide-react";
import ContractTemplate from "@/components/admin/ContractTemplate";
import { exportElementToPdf } from "@/lib/exportUtils";
import { defaultContractText } from "@/lib/contractClauses";
import { defaultEquipmentList } from "@/lib/equipmentList";

const empty = { client_id: "", contract_number: "", equipment: "", value: "", start_date: "", end_date: "", payment_terms: "", notes: "", status: "rascunho", content: "" };

export default function ContractModal({ open, onOpenChange, contract, clients, onSave }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [equipmentList, setEquipmentList] = useState(defaultEquipmentList);
  const [addingEquipment, setAddingEquipment] = useState(false);
  const [newEquipment, setNewEquipment] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      if (contract) {
        let content = "";
        if (contract.content_url) {
          try {
            const res = await fetch(contract.content_url);
            content = await res.text();
          } catch {
            content = "";
          }
        }
        if (active) setForm({ ...empty, ...contract, content });
      } else {
        setForm({ ...empty, contract_number: `RA-${Date.now().toString().slice(-6)}`, content: defaultContractText });
      }
    })();
    setAddingEquipment(false);
    setNewEquipment("");
    return () => { active = false; };
  }, [contract, open]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const selectedClient = clients.find((c) => c.id === form.client_id);

  const handleAddEquipment = () => {
    const name = newEquipment.trim();
    if (!name) return;
    if (!equipmentList.includes(name)) setEquipmentList((l) => [...l, name]);
    setForm((f) => ({ ...f, equipment: name }));
    setNewEquipment("");
    setAddingEquipment(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const file = new File([form.content || ""], `contrato-${form.contract_number || "sem-numero"}.txt`, { type: "text/plain" });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const { content, ...rest } = form;
      await onSave({ ...rest, content_url: file_url, value: parseFloat(form.value) || 0 });
    } catch (err) {
      alert("Não foi possível salvar o contrato: " + (err?.message || "erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{contract ? "Editar Contrato" : "Novo Contrato"}</DialogTitle>
        </DialogHeader>

        <div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label>Cliente</Label>
              <Select value={form.client_id} onValueChange={(v) => setForm((f) => ({ ...f, client_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o cliente..." /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClient && (
              <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-xs font-medium text-accent">
                <FileSignature className="h-4 w-4" /> Dados de {selectedClient.name} carregados no contrato para assinatura.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Número do Contrato</Label>
                <Input required value={form.contract_number} onChange={set("contract_number")} />
              </div>
              <div className="space-y-1">
                <Label>Valor (R$)</Label>
                <Input type="number" step="0.01" value={form.value} onChange={set("value")} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Equipamento</Label>
              {addingEquipment ? (
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Nome do novo equipamento"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddEquipment(); } }}
                  />
                  <Button type="button" size="sm" onClick={handleAddEquipment}>Adicionar</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setAddingEquipment(false)}>Cancelar</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select value={form.equipment} onValueChange={(v) => setForm((f) => ({ ...f, equipment: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione o equipamento..." /></SelectTrigger>
                    <SelectContent>
                      {equipmentList.map((eq) => (
                        <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" size="sm" variant="outline" onClick={() => setAddingEquipment(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Início</Label>
                <Input type="date" value={form.start_date} onChange={set("start_date")} />
              </div>
              <div className="space-y-1">
                <Label>Término</Label>
                <Input type="date" value={form.end_date} onChange={set("end_date")} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Condições de Pagamento</Label>
              <Input value={form.payment_terms} onChange={set("payment_terms")} placeholder="50% entrada + 50% na entrega" />
            </div>
            <div className="space-y-1">
              <Label>Observações</Label>
              <Textarea rows={2} value={form.notes} onChange={set("notes")} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label>Texto do Contrato (edição livre)</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!selectedClient}
                  onClick={() => exportElementToPdf("contract-template", `contrato-${form.contract_number}.pdf`)}
                >
                  <FileDown className="mr-2 h-4 w-4" /> Exportar PDF
                </Button>
              </div>
              <Textarea rows={22} className="font-mono text-xs" value={form.content} onChange={set("content")} />
            </div>
            <Button type="submit" className="w-full" disabled={saving || !form.client_id}>
              {saving ? "Salvando..." : "Salvar Contrato"}
            </Button>
          </form>
        </div>

        {selectedClient && (
          <div className="absolute -left-[9999px] top-0">
            <ContractTemplate client={selectedClient} contract={form} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}