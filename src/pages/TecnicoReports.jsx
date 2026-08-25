import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { CheckCircle2, Pencil, Plus } from "lucide-react";
import ReportForm from "@/components/tecnico/ReportForm";

export default function TecnicoReports() {
  const { user } = useOutletContext();
  const [reports, setReports] = useState([]);
  const [mode, setMode] = useState("list");
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    const data = await base44.entities.ServiceReport.filter({ technician_email: user?.email }, "-created_date");
    setReports(data);
  };

  useEffect(() => {
    if (user?.email) load();
  }, [user?.email]);

  if (mode !== "list") {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setMode("list");
            setEditing(null);
          }}
          className="mb-4 text-sm font-medium text-primary hover:underline"
        >
          ← Voltar aos relatórios
        </button>
        <h1 className="mb-4 text-2xl font-bold text-primary">
          {editing ? "Editar Relatório" : "Novo Relatório"}
        </h1>
        <ReportForm
          user={user}
          initial={editing || { report_text: "", photos: [] }}
          submitLabel={editing ? "Salvar alterações" : "Enviar Relatório"}
          onSaved={() => {
            setSaved(true);
            setMode("list");
            setEditing(null);
            load();
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Todos os relatórios ficam visíveis para o administrativo.</p>
        </div>
        <Button
          onClick={() => {
            setSaved(false);
            setEditing(null);
            setMode("create");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Relatório
        </Button>
      </div>

      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
          <CheckCircle2 className="h-4 w-4" /> Relatório salvo e disponível para o administrativo.
        </div>
      )}

      {reports.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Nenhum relatório enviado ainda.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((report) => (
          <div key={report.id} className="rounded-2xl border border-border bg-white p-4">
            <p className="text-xs text-muted-foreground">
              {format(new Date(report.created_date), "dd/MM/yyyy HH:mm")}
            </p>
            <p className="mt-2 line-clamp-4 text-sm text-foreground/80">{report.report_text}</p>
            {report.photos?.length > 0 && (
              <div className="mt-3 flex gap-2">
                {report.photos.slice(0, 3).map((url) => (
                  <div key={url} className="h-14 w-14 overflow-hidden rounded-lg border border-border">
                    <Image src={url} alt="Foto" className="h-full w-full" />
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSaved(false);
                setEditing(report);
                setMode("edit");
              }}
            >
              <Pencil className="mr-2 h-3.5 w-3.5" /> Editar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
