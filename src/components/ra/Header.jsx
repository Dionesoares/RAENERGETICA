import React, { useState } from "react";
import { Phone, Handshake, Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { waQuoteLink } from "@/lib/whatsapp";

const contacts = [
  {
    value: "Ricardo@raeneregetica.com.br",
    href: "mailto:Ricardo@raeneregetica.com.br",
    label: "Comercial — Ricardo",
  },
  {
    value: "(63) 99993-8060",
    href: "tel:+5563999938060",
    label: "Contato Ricardo",
  },
  {
    value: "dallessandro@raenergetica.com.br",
    href: "mailto:dallessandro@raenergetica.com.br",
    label: "Comercial — Dallessandro",
  },
  {
    value: "(63) 99228-2251",
    href: "tel:+5563992282251",
    label: "Contato Dallessandro",
  },
];

const navLinks = [
  { label: "Produtos", href: "#geradores", dropdown: true },
  { label: "Serviços", href: "#sobre" },
  { label: "A RA Energética", href: "#sobre", dropdown: true },
  { label: "Contato", href: "#contato", dropdown: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      <div className="bg-[#ececec]">
        <div className="mx-auto flex max-w-[1400px]">
          <div className="hidden min-w-[230px] flex-col justify-center bg-primary px-5 py-3 text-white lg:flex">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Phone className="h-4 w-4 fill-current text-[#E3231C]" />
              Fale Conosco
            </div>
            <a href="#contato" className="mt-1 text-[11px] leading-tight text-white/85 hover:text-white">
              Localize a RA Energética perto de você
            </a>
            <a href="#sobre" className="text-[11px] leading-tight text-white/85 hover:text-white">
              Locações &amp; Eventos
            </a>
          </div>

          <div className="flex min-w-0 flex-1 items-stretch">
            <div className="hidden min-w-0 flex-1 items-stretch xl:flex">
              {contacts.map((item) => (
                <a
                  key={item.value}
                  href={item.href}
                  className="flex min-w-0 flex-1 flex-col justify-center border-r border-black/10 px-4 py-2.5 hover:bg-white/60"
                >
                  <span className="truncate text-[15px] font-bold leading-tight text-primary">{item.value}</span>
                  <span className="mt-0.5 text-[11px] text-[#6b6b6b]">{item.label}</span>
                </a>
              ))}
            </div>

            <a
              href={waQuoteLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-[130px] flex-col justify-center border-r border-black/10 px-4 py-2.5 text-center hover:bg-white/60"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8a8a8a]">Solicite um</span>
              <span className="text-sm font-extrabold uppercase leading-tight text-primary">Orçamento</span>
            </a>

            <Link
              to="/admin/login"
              className="flex min-w-[140px] items-center gap-2 border-r border-black/10 px-4 py-2.5 hover:bg-white/60"
            >
              <Handshake className="h-8 w-8 shrink-0 text-primary" strokeWidth={1.4} />
              <span className="leading-tight">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#8a8a8a]">Área do</span>
                <span className="block text-sm font-extrabold uppercase text-primary">Cliente</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto px-4 py-2 xl:hidden">
          {contacts.map((item) => (
            <a key={item.value} href={item.href} className="shrink-0">
              <span className="block text-xs font-bold text-primary">{item.value}</span>
              <span className="block text-[10px] text-[#6b6b6b]">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-black/5 bg-[#f4f6f8]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <a href="#top" className="shrink-0">
            <Logo compact />
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 px-3 py-2 text-[13px] font-extrabold uppercase tracking-wide text-primary transition-colors hover:text-[#E3231C]"
              >
                {link.label}
                {link.dropdown && <ChevronDown className="h-3.5 w-3.5" />}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-md text-primary lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-black/5 bg-white px-4 py-3 lg:hidden">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-black/5 py-3 text-sm font-bold uppercase text-primary"
              >
                {link.label}
              </a>
            ))}
            <a
              href={waQuoteLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block rounded-md bg-primary px-4 py-3 text-center text-sm font-bold uppercase text-white"
            >
              Solicite um orçamento
            </a>
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-md border border-primary px-4 py-3 text-center text-sm font-bold uppercase text-primary"
            >
              Área do cliente
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
