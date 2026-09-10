import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Mail, MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { waLinkTo } from "@/lib/whatsapp";

const STATUS_LABEL = {
  nova: "Nova",
  em_andamento: "Em andamento",
  atendida: "Atendida",
};

const STATUS_CLASS = {
  nova: "bg-destructive/10 text-destructive",
  em_andamento: "bg-accent/10 text-accent",
  atendida: "bg-emerald-50 text-emerald-700",
};

export default function AdminQuotes() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setRequests(await base44.entities.QuoteRequest.list("-created_date"));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (item, status) => {
    await base44.entities.QuoteRequest.update(item.id, { status });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Excluir esta solicitação de orçamento?")) return;
    await base44.entities.QuoteRequest.delete(id);
    toast({ title: "Solicitação excluída" });
    load();
  };

  const filtered = requests.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.company_name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term) ||
      item.generator?.toLowerCase().includes(term) ||
      item.document?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Orçamento</h1>
          <p className="mt-1 text-sm text-muted-foreground">Solicitações enviadas pelo site.</p>
        </div>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, empresa ou gerador..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </div>

      {loading && <p className="py-6 text-center text-sm text-muted-foreground">Carregando...</p>}
      {!loading && filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma solicitação encontrada.</p>
      )}

      <div className="space-y-3">
        {filtered.map((item) => (
          <article key={item.id} className="rounded-2xl border border-border bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-primary">{item.name}</h2>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[item.status] || STATUS_CLASS.nova}`}>
                    {STATUS_LABEL[item.status] || item.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.company_name || "Pessoa física"} {item.document ? `• ${item.document}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.created_date ? format(new Date(item.created_date), "dd/MM/yyyy HH:mm") : ""}
                </p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-destructive hover:opacity-70" aria-label="Excluir">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm font-medium text-primary">{item.generator}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/80">{item.message}</p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1.5 text-primary hover:text-accent">
                <Mail className="h-4 w-4" /> {item.email}
              </a>
              <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1.5 text-primary hover:text-accent">
                <Phone className="h-4 w-4" /> {item.phone}
              </a>
              <a
                href={waLinkTo(item.phone, `Olá ${item.name}, recebemos sua solicitação de orçamento.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-600 hover:underline"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.status !== "em_andamento" && (
                <Button size="sm" variant="outline" onClick={() => updateStatus(item, "em_andamento")}>
                  Marcar em andamento
                </Button>
              )}
              {item.status !== "atendida" && (
                <Button size="sm" onClick={() => updateStatus(item, "atendida")}>
                  Marcar como atendida
                </Button>
              )}
              {item.status !== "nova" && (
                <Button size="sm" variant="ghost" onClick={() => updateStatus(item, "nova")}>
                  Reabrir
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
