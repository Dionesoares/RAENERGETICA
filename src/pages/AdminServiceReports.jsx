import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { format } from "date-fns";
import ServiceReportViewModal from "@/components/admin/ServiceReportViewModal";

export default function AdminServiceReports() {
  const [reports, setReports] = useState([]);
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    base44.entities.ServiceReport.list("-created_date").then(setReports);
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">Relatórios de Suporte Técnico</h1>

      {reports.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Nenhum relatório enviado ainda.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setViewing(r)}
            className="rounded-2xl border border-border bg-white p-4 text-left transition-colors hover:border-accent/40"
          >
            <p className="font-medium text-primary">{r.technician_name || "Técnico"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{format(new Date(r.created_date), "dd/MM/yyyy HH:mm")}</p>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{r.report_text}</p>
            {r.photos?.length > 0 && (
              <div className="mt-3 flex gap-2">
                {r.photos.slice(0, 3).map((url) => (
                  <div key={url} className="h-14 w-14 overflow-hidden rounded-lg border border-border">
                    <Image src={url} alt="Foto" className="h-full w-full" />
                  </div>
                ))}
                {r.photos.length > 3 && (
                  <div className="grid h-14 w-14 place-items-center rounded-lg border border-border bg-secondary text-xs font-medium text-muted-foreground">
                    +{r.photos.length - 3}
                  </div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      <ServiceReportViewModal open={!!viewing} onOpenChange={(v) => !v && setViewing(null)} report={viewing} />
    </div>
  );
}