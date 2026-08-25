import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image } from "@/components/ui/image";
import { Loader2, Camera, X, CheckCircle2 } from "lucide-react";

export default function TecnicoDashboard() {
  const [user, setUser] = useState(null);
  const [reportText, setReportText] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPhotos((prev) => [...prev, file_url]);
    }
    setUploading(false);
    e.target.value = "";
  };

  const removePhoto = (url) => setPhotos((prev) => prev.filter((p) => p !== url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.ServiceReport.create({
      technician_name: user?.full_name || user?.email || "Técnico",
      report_text: reportText,
      photos,
    });
    setSaving(false);
    setSuccess(true);
    setReportText("");
    setPhotos([]);
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-primary">Novo Relatório</h1>
      <p className="mb-6 text-sm text-muted-foreground">Registre o atendimento com fotos e um relatório do serviço realizado.</p>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
          <CheckCircle2 className="h-4 w-4" /> Relatório enviado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-white p-6">
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
          <Label>Fotos</Label>
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
                    onClick={() => removePhoto(url)}
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
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar Relatório"}
        </Button>
      </form>
    </div>
  );
}