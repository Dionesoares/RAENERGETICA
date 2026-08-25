import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Phone, MessageCircle, Instagram } from "lucide-react";
import Logo from "./Logo";
import { waLink } from "@/lib/whatsapp";
import { COMPANY_ADDRESS } from "@/lib/company";

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
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
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
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Ricardo@raeneregetica.com.br</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> dallessandro@raenergetica.com.br</li>
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
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} RA Energética. Todos os direitos reservados.</span>
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
            className="fixed bottom-6 right-6 z-50 hidden items-center gap-2 rounded-full bg-accent px-5 py-3.5 font-semibold text-primary shadow-2xl shadow-accent/40 md:flex"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden text-sm sm:inline">Suporte Direto</span>
          </motion.a>
        )}
      </AnimatePresence>
    </footer>
  );
}