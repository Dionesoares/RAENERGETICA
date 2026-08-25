import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/whatsapp";
import { generatorsByPower, generatorUseCases } from "@/lib/equipmentList";

const quoteMessage = (generator) =>
  `Preciso de um orçamento para esse gerador: ${generator.title}.`;

export default function Generators() {
  const [selectedKva, setSelectedKva] = useState(null);
  const detailRef = useRef(null);
  const selected = generatorsByPower.find((item) => item.kva === selectedKva);

  useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selected]);

  return (
    <section id="geradores" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="font-heading text-2xl font-extrabold text-primary sm:text-4xl lg:text-5xl">Nossos Geradores</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Locação de geradores por potência, com aplicação típica e cotação direta no WhatsApp.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {generatorUseCases.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-heading text-base font-bold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <h3 className="font-heading text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">Locação por potência</h3>
        <p className="mt-2 text-muted-foreground">
          Cada potência tem página própria com aplicação típica e cotação de locação.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {generatorsByPower.map((generator) => {
            const active = selectedKva === generator.kva;
            return (
              <button
                key={generator.kva}
                type="button"
                aria-expanded={active}
                onClick={() => setSelectedKva(active ? null : generator.kva)}
                className={`min-h-[56px] rounded-lg border px-3 py-3 text-center text-sm font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:border-primary/50 hover:bg-slate-50"
                }`}
              >
                {generator.title}
              </button>
            );
          })}
        </div>

        <div ref={detailRef}>
          <AnimatePresence>
            {selected && (
              <motion.div
                key={selected.kva}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {selected.kva} kVA
                  </p>
                  <h4 className="mt-1 font-heading text-2xl font-bold text-primary">{selected.title}</h4>
                  <p className="mt-4 max-w-3xl text-muted-foreground">{selected.description}</p>
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Aplicação típica: {selected.application}
                  </p>
                  <a
                    href={waLink(quoteMessage(selected))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold uppercase text-white"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Contratar
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
