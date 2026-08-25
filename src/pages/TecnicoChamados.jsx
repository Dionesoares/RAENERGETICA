import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Circle, ClipboardList } from "lucide-react";
import ReportForm from "@/components/tecnico/ReportForm";

export default function TecnicoChamados() {
  const { user } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [active, setActive] = useState(null);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    const data = await base44.entities.Task.filter({ technician_email: user?.email }, "-date");
    setTasks(data);
  };

  useEffect(() => {
    if (user?.email) load();
  }, [user?.email]);

  const pending = tasks.filter((task) => task.status !== "concluida");
  const done = tasks.filter((task) => task.status === "concluida");

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-primary">Chamados</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Chamados enviados pelo painel administrativo. Anexe fotos e registre o relatório do serviço.
      </p>

      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
          <CheckCircle2 className="h-4 w-4" /> Relatório enviado. Ele já está disponível na página Relatórios do administrativo.
        </div>
      )}

      {active ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setActive(null)}
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Voltar aos chamados
          </button>
          <ReportForm
            user={user}
            task={active}
            onSaved={() => {
              setSaved(true);
              setActive(null);
              load();
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-white p-5">
            <h2 className="mb-4 font-semibold text-primary">Pendentes</h2>
            {pending.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">Nenhum chamado pendente.</p>
            )}
            <div className="space-y-2">
              {pending.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    setSaved(false);
                    setActive(task);
                  }}
                  className="flex w-full items-start gap-3 rounded-xl border border-border p-3 text-left hover:border-primary/40"
                >
                  <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.date && format(new Date(task.date), "dd/MM/yyyy", { locale: ptBR })}
                      {task.time ? ` • ${task.time}` : ""}
                    </p>
                    {task.description && <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <ClipboardList className="h-3 w-3" /> Relatar
                  </span>
                </button>
              ))}
            </div>
          </section>

          {done.length > 0 && (
            <section className="rounded-2xl border border-border bg-white p-5">
              <h2 className="mb-4 font-semibold text-primary">Concluídos</h2>
              <div className="space-y-2">
                {done.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-muted-foreground line-through">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.date && format(new Date(task.date), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
