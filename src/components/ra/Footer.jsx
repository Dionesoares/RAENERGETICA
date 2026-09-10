import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Phone, MessageCircle, Instagram, CreditCard, Barcode, ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import { waLink } from "@/lib/whatsapp";
import { COMPANY_ADDRESS, COMPANY_EMAILS } from "@/lib/company";
import { openLgpdPopup } from "./LgpdPopup";

function PixIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M15.47 4.2 19.8 8.53a2.4 2.4 0 0 1 0 3.4l-4.33 4.32a.8.8 0 0 1-1.13 0l-4.2-4.2a.8.8 0 0 0-1.13 0l-4.2 4.2a.8.8 0 0 1-1.13 0L.35 12.92a2.4 2.4 0 0 1 0-3.4L4.68 5.2a.8.8 0 0 1 1.13 0l4.2 4.2a.8.8 0 0 0 1.13 0l4.2-4.2a.8.8 0 0 1 1.13 0Z"
      />
    </svg>
  );
}

const payments = [
  { label: "Cartão", Icon: CreditCard },
  { label: "PIX", Icon: PixIcon },
  { label: "Boleto", Icon: Barcode },
];

export default function Footer() {
  const [fab, setFab] = useState(false);
  useEffect(() => {
    const onScroll = () => setFab(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 grid-lines opacity-10" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <div className="mx-auto w-full max-w-[260px] sm:mx-0">
              <Logo light tiny />
            </div>
            <p className="mt-5 max-w-xs text-sm text-white/60">
              Energia que constrói. Locação de geradores para eventos e empreendimentos em todo o Brasil.
            </p>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>

          <div className="min-w-0">
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-white/90">Contatos</h3>
            <ul className="mt-5 space-y-3 break-all text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${COMPANY_EMAILS.comercial}`} className="hover:text-white">{COMPANY_EMAILS.comercial}</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${COMPANY_EMAILS.ricardo}`} className="hover:text-white">{COMPANY_EMAILS.ricardo}</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${COMPANY_EMAILS.dallessandro}`} className="hover:text-white">{COMPANY_EMAILS.dallessandro}</a>
              </li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" /> (63) 99993-8060</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" /> (63) 99228-2251</li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-white/90">Endereço</h3>
            <p className="mt-5 flex items-start gap-3 text-sm text-white/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {COMPANY_ADDRESS}
            </p>
            <div className="mt-6 flex gap-3">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-inset ring-white/20 transition-colors hover:bg-accent hover:text-primary">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/raenergetica/" target="_blank" rel="noopener noreferrer" aria-label="Instagram RA Energética" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-inset ring-white/20 transition-colors hover:bg-accent hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-white/90">Formas de pagamento</h3>
            <ul className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-1 sm:gap-3">
              {payments.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-center ring-1 ring-inset ring-white/15 sm:flex-row sm:text-left"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/20 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/85 sm:text-sm sm:normal-case sm:tracking-normal">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} RA Energética. Todos os direitos reservados.</span>
          <button
            type="button"
            onClick={openLgpdPopup}
            className="inline-flex items-center gap-1.5 font-medium text-white/70 transition-colors hover:text-white"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            LGPD • Proteção de dados
          </button>
          <span>Geradores • Palmas, TO</span>
        </div>
      </div>

      <AnimatePresence>
        {fab && (
          <motion.a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-semibold text-white shadow-2xl shadow-emerald-700/40 hover:bg-[#20bd5a] md:bottom-6 md:right-6"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm uppercase">Contato via WhatsApp</span>
          </motion.a>
        )}
      </AnimatePresence>
    </footer>
  );
}