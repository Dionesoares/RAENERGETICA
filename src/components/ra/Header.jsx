import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { waLink } from "@/lib/whatsapp";

const links = [
  { label: "Geradores", href: "#geradores" },
  { label: "Sobre Nós", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3"
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-6 ${
          scrolled ? "glass shadow-xl shadow-primary/5" : "bg-transparent"
        }`}
      >
        <a href="#top" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/login"
            className="hidden min-h-[44px] items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary sm:flex"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Link>
          <Link
            to="/admin/login"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/20 text-primary sm:hidden"
            aria-label="Login"
          >
            <LogIn className="h-5 w-5" />
          </Link>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.03]"
          >
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3">
              <span className="absolute inset-0 animate-pulse-dot rounded-full bg-accent" />
              <span className="absolute inset-0 rounded-full bg-accent/40" />
            </span>
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}