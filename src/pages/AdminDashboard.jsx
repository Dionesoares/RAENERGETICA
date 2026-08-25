import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { format, isSameDay } from "date-fns";
import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MiniCalendar from "@/components/admin/MiniCalendar";
import TaskModal from "@/components/admin/TaskModal";

const priorityColor = { alta: "bg-destructive/10 text-destructive", media: "bg-accent/10 text-accent", baixa: "bg-secondary text-muted-foreground" };

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const data = await base44.entities.Task.list("-date");
    setTasks(data);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (editing) await base44.entities.Task.update(editing.id, form);
    else await base44.entities.Task.create(form);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const toggleStatus = async (task) => {
    await base44.entities.Task.update(task.id, { status: task.status === "pendente" ? "concluida" : "pendente" });
    load();
  };

  const handleDelete = async (id) => {
    await base44.entities.Task.delete(id);
    load();
  };

  const dayTasks = tasks.filter((t) => t.date && isSameDay(new Date(t.date), selectedDate));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">Dashboard</h1>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <MiniCalendar taskDates={tasks.map((t) => t.date)} selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-primary">
              Agenda de {format(selectedDate, "dd/MM/yyyy")}
            </h2>
            <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>
              <Plus className="mr-1 h-4 w-4" /> Tarefa
            </Button>
          </div>

          {dayTasks.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma tarefa para este dia.</p>
          )}

          <div className="space-y-2">
            {dayTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <button onClick={() => toggleStatus(t)}>
                  {t.status === "concluida" ? (
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${t.status === "concluida" ? "text-muted-foreground line-through" : ""}`}>
                    {t.title} {t.time && <span className="text-xs text-muted-foreground">• {t.time}</span>}
                  </p>
                  {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                  {t.technician_email && (
                    <p className="mt-1 text-[11px] font-medium text-primary">Chamado para técnico</p>
                  )}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityColor[t.priority]}`}>
                  {t.priority}
                </span>
                <button onClick={() => handleDelete(t.id)} className="text-destructive hover:opacity-70">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        task={editing ?? { date: format(selectedDate, "yyyy-MM-dd") }}
        onSave={handleSave}
      />
    </div>
  );
}