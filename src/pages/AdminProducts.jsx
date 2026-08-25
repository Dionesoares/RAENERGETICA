import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ProductModal from "@/components/admin/ProductModal";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setProducts(await base44.entities.Product.list("-created_date"));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    if (editing) await base44.entities.Product.update(editing.id, data);
    else await base44.entities.Product.create(data);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Excluir este produto? Ele deixará de aparecer no site.")) return;
    await base44.entities.Product.delete(id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Produtos</h1>
        <Button
          size="lg"
          className="h-14 px-8 text-base"
          onClick={() => { setEditing(null); setModalOpen(true); }}
        >
          <Plus className="mr-2 h-5 w-5" /> Novo Produto
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 && (
          <p className="col-span-full py-6 text-center text-muted-foreground">Nenhum produto cadastrado.</p>
        )}
        {products.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="aspect-[4/3] bg-secondary/40 p-4">
              <Image src={p.image_url} alt={p.title} fittingType="fit" className="h-full w-full" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-primary">{p.title}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-3 flex justify-end gap-3">
                <button onClick={() => { setEditing(p); setModalOpen(true); }} className="text-primary hover:text-accent">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-destructive hover:opacity-70">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductModal open={modalOpen} onOpenChange={setModalOpen} product={editing} onSave={handleSave} />
    </div>
  );
}