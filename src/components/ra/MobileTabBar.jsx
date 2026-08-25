import React from "react";
import { Home, Zap, Info, Phone, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

const tabs = [
  { label: "Início", href: "#top", icon: Home },
  { label: "Geradores", href: "#geradores", icon: Zap },
  { label: "Sobre", href: "#sobre", icon: Info },
  { label: "Contato", href: "#contato", icon: Phone },
];

export default function MobileTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-border bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] backdrop-blur-lg md:hidden"
      aria-label="Navegação"
    >
      {tabs.map((t) => (
        <a
          key={t.href}
          href={t.href}
          className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium text-muted-foreground transition-colors active:bg-secondary active:text-primary"
        >
          <t.icon className="h-5 w-5" strokeWidth={2} />
          {t.label}
        </a>
      ))}
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold text-accent"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={2} />
        WhatsApp
      </a>
    </nav>
  );
}