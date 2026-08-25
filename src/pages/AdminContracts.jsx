import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, FileDown } from "lucide-react";
import ContractModal from "@/components/admin/ContractModal";
import ContractTemplate from "@/components/admin/ContractTemplate";
import { exportElementToPdf } from "@/lib/exportUtils";
import { defaultContractText } from "@/lib/contractClauses";

const statusColor = { rascunho: "bg-secondary text-muted-foreground", assinado: "bg-accent/10 text-accent" };

export default function AdminContracts() {
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [downloadTarget, setDownloadTarget] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const load = async () => {
    const [ct, cl] = await Promise.all([
      base44.entities.Contract.list("-created_date"),
      base44.entities.Client.list(),
    ]);
    setContracts(ct);
    setClients(cl);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (editing) await base44.entities.Contract.update(editing.id, form);
    else await base44.entities.Contract.create(form);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Excluir este contrato?")) return;
    await base44.entities.Contract.delete(id);
    load();
  };

  const clientName = (id) => clients.find((c) => c.id === id)?.name || "-";

  const handleDownloadPdf = async (c) => {
    const client = clients.find((cl) => cl.id === c.client_id);
    if (!client) { alert("Cliente do contrato não encontrado."); return; }
    setDownloadingId(c.id);
    let content = defaultContractText;
    if (c.content_url) {
      try {
        const res = await fetch(c.content_url);
        content = await res.text();
      } catch {
        content = defaultContractText;
      }
    }
    setDownloadTarget({ contract: { ...c, content }, client });
  };

  useEffect(() => {
    if (!downloadTarget) return;
    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        if (cancelled) return;
        await exportElementToPdf("contract-template-download", `contrato-${downloadTarget.contract.contract_number}.pdf`);
        setDownloadTarget(null);
        setDownloadingId(null);
      });
    });
    return () => { cancelled = true; };
  }, [downloadTarget]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Contratos</h1>
        <Button
          size="lg"
          className="h-14 px-8 text-base"
          onClick={() => { setEditing(null); setModalOpen(true); }}
        >
          <Plus className="mr-2 h-5 w-5" /> Novo Contrato
        </Button>
      </div>

      {contracts.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Nenhum contrato criado.</p>
      )}

      {/* Mobile cards */}
      {contracts.length > 0 && (
        <div className="space-y-3 lg:hidden">
          {contracts.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{c.contract_number}</p>
                  <p className="text-sm text-muted-foreground">{clientName(c.client_id)}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor[c.status]}`}>{c.status}</span>
              </div>
              <p className="break-words text-sm text-muted-foreground">Equipamento: {c.equipment || "-"}</p>
              <p className="break-words text-sm text-muted-foreground">Vigência: {c.start_date} - {c.end_date}</p>
              <div className="mt-3 flex gap-3">
                <button onClick={() => { setEditing(c); setModalOpen(true); }} className="text-primary hover:text-accent">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDownloadPdf(c)}
                  disabled={downloadingId === c.id}
                  className="text-primary hover:text-accent disabled:opacity-40"
                >
                  <FileDown className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-destructive hover:opacity-70">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop table */}
      {contracts.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-white lg:block">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nº</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Equipamento</th>
                <th className="px-4 py-3">Vigência</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contracts.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium">{c.contract_number}</td>
                  <td className="px-4 py-3">{clientName(c.client_id)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.equipment || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.start_date} - {c.end_date}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(c); setModalOpen(true); }} className="mr-2 text-primary hover:text-accent">
                      <Pencil className="inline h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(c)}
                      disabled={downloadingId === c.id}
                      className="mr-2 text-primary hover:text-accent disabled:opacity-40"
                    >
                      <FileDown className="inline h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="text-destructive hover:opacity-70">
                      <Trash2 className="inline h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ContractModal open={modalOpen} onOpenChange={setModalOpen} contract={editing} clients={clients} onSave={handleSave} />

      {downloadTarget && (
        <div className="absolute -left-[9999px] top-0">
          <ContractTemplate id="contract-template-download" client={downloadTarget.client} contract={downloadTarget.contract} />
        </div>
      )}
    </div>
  );
}