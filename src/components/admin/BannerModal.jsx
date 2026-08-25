import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { Loader2, Upload } from "lucide-react";

const empty = { image_url: "", caption: "", sort_order: 0, active: true };

export default function BannerModal({ open, onOpenChange, banner, onSave }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(banner ? { ...empty, ...banner } : empty);
  }, [banner, open]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm((f) => ({ ...f, image_url: file_url }));
    } catch (err) {
      alert(err?.message || "Falha ao enviar a imagem do banner.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, created_date, updated_date, created_at, updated_at, created_by_id, ...data } = form;
      await onSave({
        ...data,
        sort_order: Number(data.sort_order) || 0,
        active: Boolean(data.active),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{banner ? "Editar banner" : "Novo banner"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label>Imagem do banner</Label>
            <div className="flex items-center gap-3">
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="h-16 w-28 rounded-lg border border-border object-cover" />
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-accent hover:text-accent">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Enviando..." : "Enviar imagem"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Legenda</Label>
            <Textarea
              rows={3}
              value={form.caption || ""}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              placeholder="Texto que aparece sobre o banner"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Ordem</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
              />
            </div>
            <label className="mt-6 flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.active !== false}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Ativo no site
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={saving || uploading || !form.image_url}>
            {saving ? "Salvando..." : "Salvar banner"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
