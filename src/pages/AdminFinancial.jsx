import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Wallet, FileDown, Sheet, Trash2, Pencil, Clock, Calculator } from "lucide-react";
import TransactionModal from "@/components/admin/TransactionModal";
import DashboardCalculator from "@/components/admin/DashboardCalculator";
import { exportElementToPdf, exportToCsv } from "@/lib/exportUtils";

const money = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminFinancial() {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const load = async () => {
    const [t, c] = await Promise.all([
      base44.entities.Transaction.list("-date"),
      base44.entities.Client.list(),
    ]);
    setTransactions(t);
    setClients(c);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    const payload = {
      type: form.type,
      description: form.description,
      category: form.category,
      amount: Number(form.amount || 0),
      date: form.date,
      payment_method: form.payment_method,
      client_id: form.client_id || null,
      status: form.status || "pago",
    };
    if (editing) await base44.entities.Transaction.update(editing.id, payload);
    else await base44.entities.Transaction.create(payload);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Excluir este lançamento?")) return;
    await base44.entities.Transaction.delete(id);
    load();
  };

  const totals = useMemo(() => {
    const paid = (t) => t.status !== "pendente";
    const income = transactions.filter((t) => t.type === "entrada" && paid(t)).reduce((s, t) => s + Number(t.amount || 0), 0);
    const expense = transactions.filter((t) => t.type === "saida" && paid(t)).reduce((s, t) => s + Number(t.amount || 0), 0);
    const pendingIn = transactions.filter((t) => t.type === "entrada" && t.status === "pendente").reduce((s, t) => s + Number(t.amount || 0), 0);
    const pendingOut = transactions.filter((t) => t.type === "saida" && t.status === "pendente").reduce((s, t) => s + Number(t.amount || 0), 0);
    return { income, expense, balance: income - expense, pending: pendingIn - pendingOut };
  }, [transactions]);

  const clientName = (id) => clients.find((c) => c.id === id)?.name || "-";

  const handleExportPdf = () => exportElementToPdf("financial-report", "relatorio-financeiro.pdf");
  const handleExportExcel = () => exportToCsv(
    "relatorio-financeiro.csv",
    transactions.map((t) => ({ ...t, client: clientName(t.client_id) })),
    [
      { key: "date", label: "Data" },
      { key: "type", label: "Tipo" },
      { key: "description", label: "Descrição" },
      { key: "category", label: "Categoria" },
      { key: "amount", label: "Valor" },
      { key: "client", label: "Cliente" },
      { key: "status", label: "Situação" },
    ]
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Financeiro</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setCalculatorOpen((value) => !value)}>
            <Calculator className="mr-2 h-4 w-4" /> Calculadora
          </Button>
          <Button variant="outline" onClick={handleExportPdf}><FileDown className="mr-2 h-4 w-4" /> PDF</Button>
          <Button variant="outline" onClick={handleExportExcel}><Sheet className="mr-2 h-4 w-4" /> Excel</Button>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Lançamento</Button>
        </div>
      </div>

      {calculatorOpen && (
        <div className="mb-6">
          <DashboardCalculator />
        </div>
      )}

      <div id="financial-report">
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4 text-accent" /> Entradas</div>
            <p className="text-xl font-bold text-accent">{money(totals.income)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><TrendingDown className="h-4 w-4 text-destructive" /> Saídas</div>
            <p className="text-xl font-bold text-destructive">{money(totals.expense)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><Wallet className="h-4 w-4 text-primary" /> Saldo</div>
            <p className="text-xl font-bold text-primary">{money(totals.balance)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-amber-600" /> Saldo pendente</div>
            <p className="text-xl font-bold text-amber-700">{money(totals.pending)}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Situação</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">Nenhum lançamento.</td></tr>
              )}
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3">{t.date}</td>
                  <td className="px-4 py-3 font-medium">{t.description}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.category || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{clientName(t.client_id)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.status === "pendente" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                      {t.status === "pendente" ? "Pendente" : "Pago"}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${t.type === "entrada" ? "text-accent" : "text-destructive"}`}>
                    {t.type === "entrada" ? "+" : "-"} {money(t.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(t); setModalOpen(true); }} className="mr-2 text-primary hover:text-accent">
                      <Pencil className="inline h-4 w-4" />
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
      </div>

      <TransactionModal open={modalOpen} onOpenChange={setModalOpen} transaction={editing} clients={clients} onSave={handleSave} />
    </div>
  );
}