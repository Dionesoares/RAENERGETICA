import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, Timer, Users } from "lucide-react";
import TiltCard from "./TiltCard";

const values = [
  { icon: ShieldCheck, title: "Instalações Rápidas e Seguras", desc: "Montagem técnica eficiente, com protocolos de segurança em todo o processo." },
  { icon: HeartHandshake, title: "Respeito e Profissionalismo", desc: "Atendimento humano e técnico, do primeiro contato ao encerramento do evento." },
  { icon: Timer, title: "Atendimento Rápido", desc: "Resposta ágil e suporte dedicado para que sua energia nunca falhe." },
  { icon: Users, title: "Especialistas e Equipe Experiente", desc: "Profissionais capacitados para operar equipamentos de 50 a 1400 kVA." },
];

export default function ValuesCards() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <TiltCard className="group h-full bg-primary p-6 text-white shadow-xl shadow-primary/20">
              <div style={{ transform: "translateZ(40px)" }} className="preserve-3d">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/20">
                  <v.icon className="h-7 w-7 text-accent" strokeWidth={1.6} />
                </div>
                <h3 className="font-heading text-lg font-bold leading-snug">{v.title}</h3>
                <p className="mt-2 text-sm text-white/70">{v.desc}</p>
              </div>
              <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}