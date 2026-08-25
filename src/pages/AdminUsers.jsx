import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminUserModal from "@/components/admin/AdminUserModal";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";

export default function AdminUsers() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,role,created_at")
      .eq("role", "admin")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Não foi possível carregar os usuários", description: error.message, variant: "destructive" });
      return;
    }
    setAdmins(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (form) => {
    await base44.functions.invoke("sendAdminAccess", {
      name: form.name,
      email: String(form.email || "").trim().toLowerCase(),
      password: form.password,
    });
    toast({
      title: editing ? "Administrador atualizado" : "Usuário cadastrado",
      description: `${form.email} já pode entrar em /admin/login.`,
    });
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleRevoke = async (admin) => {
    if (admin.id === user?.id) {
      toast({ title: "Ação bloqueada", description: "Você não pode remover o próprio acesso.", variant: "destructive" });
      return;
    }
    if (!confirm(`Remover o acesso administrativo de ${admin.email}?`)) return;
    try {
      await base44.functions.invoke("sendAdminAccess", { email: admin.email, action: "revoke" });
      toast({ title: "Acesso removido", description: admin.email });
      load();
    } catch (err) {
      toast({ title: "Não foi possível remover o acesso", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Cadastrar usuário</h1>
          <p className="text-sm text-muted-foreground">
            Libere e-mail e senha para outros administradores da plataforma.
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
          <Plus className="mr-2 h-5 w-5" /> Novo administrador
        </Button>
      </div>

      {admins.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Nenhum administrador listado.</p>
      )}

      {admins.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-4 py-3 font-medium">{admin.full_name || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{admin.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      title="Atualizar senha"
                      onClick={() => {
                        setEditing(admin);
                        setModalOpen(true);
                      }}
                      className="mr-2 text-primary hover:text-accent"
                    >
                      <Pencil className="inline h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Remover acesso"
                      onClick={() => handleRevoke(admin)}
                      className="text-destructive hover:opacity-70"
                    >
                      <Trash2 className="inline h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminUserModal open={modalOpen} onOpenChange={setModalOpen} user={editing} onSave={handleSave} />
    </div>
  );
}
