import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import BannerModal from "@/components/admin/BannerModal";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setBanners(await base44.entities.Banner.list("sort_order"));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editing) await base44.entities.Banner.update(editing.id, data);
      else await base44.entities.Banner.create(data);
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      alert(err?.message || "Não foi possível salvar o banner.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Excluir este banner do carrossel?")) return;
    await base44.entities.Banner.delete(id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Banners</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Troque as imagens e legendas do carrossel da página inicial.
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
          <Plus className="mr-2 h-5 w-5" /> Novo banner
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {banners.length === 0 && (
          <p className="col-span-full py-6 text-center text-muted-foreground">
            Nenhum banner cadastrado. O site usa as imagens padrão até você adicionar um.
          </p>
        )}
        {banners.map((banner) => (
          <div key={banner.id} className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="aspect-[16/7] bg-secondary/40">
              <img src={banner.image_url} alt={banner.caption || "Banner"} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-primary">{banner.caption || "Sem legenda"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ordem {banner.sort_order ?? 0} · {banner.active === false ? "Inativo" : "Ativo"}
              </p>
              <div className="mt-3 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEditing(banner);
                    setModalOpen(true);
                  }}
                  className="text-primary hover:text-accent"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(banner.id)} className="text-destructive hover:opacity-70">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BannerModal open={modalOpen} onOpenChange={setModalOpen} banner={editing} onSave={handleSave} />
    </div>
  );
}
