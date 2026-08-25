import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import ClientModal from "@/components/admin/ClientModal";

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Client.list("-created_date");
    setClients(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (editing) await base44.entities.Client.update(editing.id, form);
    else await base44.entities.Client.create(form);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Excluir este cliente?")) return;
    await base44.entities.Client.delete(id);
    load();
  };

  const filtered = clients.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.document?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Clientes</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou documento..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading && <p className="py-6 text-center text-sm text-muted-foreground">Carregando...</p>}
      {!loading && filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
      )}

      {/* Mobile cards */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3 lg:hidden">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <span className="text-xs uppercase text-muted-foreground">{c.type}</span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditing(c); setModalOpen(true); }} className="text-primary hover:text-accent">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="text-destructive hover:opacity-70">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="break-words text-sm text-muted-foreground">Doc: {c.document}</p>
              <p className="break-words text-sm text-muted-foreground">{c.phone || c.email}</p>
            </div>
          ))}
        </div>
      )}

      {/* Desktop table */}
      {!loading && filtered.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-white lg:block">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Contato</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 uppercase text-muted-foreground">{c.type}</td>
                  <td className="px-4 py-3">{c.document}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone || c.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(c); setModalOpen(true); }} className="mr-2 text-primary hover:text-accent">
                      <Pencil className="inline h-4 w-4" />
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

      <ClientModal open={modalOpen} onOpenChange={setModalOpen} client={editing} onSave={handleSave} />
    </div>
  );
}