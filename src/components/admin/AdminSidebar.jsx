import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, Users, FileText, LogOut, Package, X, Wrench, ClipboardList, Images } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Logo from "@/components/ra/Logo";

const items = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Financeiro", to: "/admin/financeiro", icon: Wallet },
  { label: "Clientes", to: "/admin/clientes", icon: Users },
  { label: "Contratos", to: "/admin/contratos", icon: FileText },
  { label: "Produtos", to: "/admin/produtos", icon: Package },
  { label: "Banners", to: "/admin/banners", icon: Images },
  { label: "Técnicos", to: "/admin/tecnicos", icon: Wrench },
  { label: "Relatórios", to: "/admin/relatorios", icon: ClipboardList },
];

export default function AdminSidebar({ open, onClose }) {
  const { logout } = useAuth();
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-border bg-white p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div>
            <Logo tiny />
            <p className="mt-1 text-xs text-muted-foreground">Painel Administrativo</p>
          </div>
          <button onClick={onClose} className="text-foreground/60 hover:text-foreground lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-white" : "text-foreground/70 hover:bg-secondary"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </aside>
    </>
  );
}