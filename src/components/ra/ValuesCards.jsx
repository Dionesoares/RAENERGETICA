import React from "react";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

const values = [
  {
    title: "Instalações Rápidas e Seguras",
    desc: "Montagem técnica eficiente, com protocolos de segurança em todo o processo.",
    image: "/values/instalacoes-rapidas-e-seguras.jpg",
  },
  {
    title: "Respeito e Profissionalismo",
    desc: "Atendimento humano e técnico, do primeiro contato ao encerramento do evento.",
    image: "/values/respeito-e-profissionalismo.jpg",
  },
  {
    title: "Atendimento Rápido",
    desc: "Resposta ágil e suporte dedicado para que sua energia nunca falhe.",
    image: "/values/atendimento-rapido.jpg",
  },
  {
    title: "Especialistas e Equipe Experiente",
    desc: "Profissionais capacitados para operar equipamentos de 50 a 1400 kVA.",
    image: "/values/especialistas-e-equipe-experiente.jpg",
  },
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
            <TiltCard className="group h-full min-h-[300px] overflow-hidden p-0 text-white shadow-xl shadow-primary/20 sm:min-h-[340px]">
              <img
                src={v.image}
                alt={v.title}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-primary/20" />
              <div className="relative z-10 flex h-full min-h-[300px] flex-col justify-end p-5 sm:min-h-[340px]">
                <h3 className="font-heading text-[1.35rem] font-extrabold uppercase leading-tight tracking-wide text-white/70 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">{v.desc}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
