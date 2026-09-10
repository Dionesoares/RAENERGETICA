import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PartnerModal from "@/components/admin/PartnerModal";

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setPartners(await base44.entities.Partner.list("sort_order"));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editing) await base44.entities.Partner.update(editing.id, data);
      else await base44.entities.Partner.create(data);
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      alert(err?.message || "Não foi possível salvar o parceiro.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Excluir este parceiro da página inicial?")) return;
    await base44.entities.Partner.delete(id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Parceiros</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre logos e mensagens exibidas na seção Nossos Parceiros da página inicial.
          </p>
        </div>
        <Button
          size="lg"
          className="h-14 px-8 text-base"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-5 w-5" /> Novo parceiro
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.length === 0 && (
          <p className="col-span-full py-6 text-center text-muted-foreground">
            Nenhum parceiro cadastrado. Adicione o primeiro para aparecer no site.
          </p>
        )}
        {partners.map((partner) => (
          <div key={partner.id} className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="flex h-36 items-center justify-center bg-secondary/40 p-4">
              <img src={partner.logo_url} alt={partner.name || "Parceiro"} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-primary">{partner.name || "Sem nome"}</p>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {partner.message || "Sem mensagem"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Ordem {partner.sort_order ?? 0} · {partner.active === false ? "Inativo" : "Ativo"}
              </p>
              <div className="mt-3 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEditing(partner);
                    setModalOpen(true);
                  }}
                  className="text-primary hover:text-accent"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(partner.id)} className="text-destructive hover:opacity-70">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PartnerModal open={modalOpen} onOpenChange={setModalOpen} partner={editing} onSave={handleSave} />
    </div>
  );
}
