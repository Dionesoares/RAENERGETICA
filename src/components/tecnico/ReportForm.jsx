import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image } from "@/components/ui/image";
import { Loader2, Camera, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ReportForm({
  user,
  initial = { report_text: "", photos: [] },
  task = null,
  onSaved,
  submitLabel = "Enviar Relatório",
}) {
  const [reportText, setReportText] = useState(initial.report_text || "");
  const [photos, setPhotos] = useState(initial.photos || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setPhotos((prev) => [...prev, file_url]);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        technician_name: user?.full_name || user?.email || "Técnico",
        technician_email: user?.email || "",
        technician_id: user?.technician_id || null,
        report_text: reportText,
        photos,
        task_id: task?.id || initial.task_id || null,
      };
      let saved;
      if (initial.id) {
        saved = await base44.entities.ServiceReport.update(initial.id, payload);
      } else {
        saved = await base44.entities.ServiceReport.create(payload);
        if (task?.id) {
          await base44.entities.Task.update(task.id, { status: "concluida" });
        }
      }
      onSaved?.(saved);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-white p-6">
      {task && (
        <div className="rounded-xl bg-secondary/60 p-3 text-sm">
          <p className="font-medium text-primary">{task.title}</p>
          {task.description && <p className="mt-1 text-muted-foreground">{task.description}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="report-text">Relatório do atendimento</Label>
        <Textarea
          id="report-text"
          required
          rows={6}
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="Descreva o serviço realizado, condições do equipamento, observações..."
        />
      </div>

      <div className="space-y-2">
        <Label>Fotos do serviço</Label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/40 p-6 text-sm font-medium text-muted-foreground hover:border-accent/40">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          {uploading ? "Enviando..." : "Anexar fotos"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
        </label>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((url) => (
              <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                <Image src={url} alt="Foto anexada" className="h-full w-full" />
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => prev.filter((item) => item !== url))}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="h-11 w-full font-semibold" disabled={saving || uploading}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
      </Button>
    </form>
  );
}
