import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { format } from "date-fns";

export default function ServiceReportViewModal({ open, onOpenChange, report }) {
  if (!report) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Relatório de {report.technician_name}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          {format(new Date(report.created_date), "dd/MM/yyyy HH:mm")}
        </p>
        <p className="whitespace-pre-wrap text-sm text-foreground/80">{report.report_text}</p>
        {report.photos?.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {report.photos.map((url) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden rounded-lg border border-border">
                <Image src={url} alt="Foto do relatório" className="h-full w-full" />
              </a>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}