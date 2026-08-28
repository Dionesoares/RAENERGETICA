import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/whatsapp";
import { generatorsByPower, generatorUseCases } from "@/lib/equipmentList";

const quoteMessage = (generator) =>
  `Preciso de um orçamento para esse gerador: ${generator.title}.`;

const GENERATOR_IMAGE = "/geradores/raenergetica-gerador.png";

function thumbnailSize(kva) {
  const minKva = 15;
  const maxKva = 670;
  const minPx = 144;
  const maxPx = 296;
  const t = (Math.sqrt(kva) - Math.sqrt(minKva)) / (Math.sqrt(maxKva) - Math.sqrt(minKva));
  return Math.round(minPx + Math.min(1, Math.max(0, t)) * (maxPx - minPx));
}

export default function Generators() {
  const [selectedKva, setSelectedKva] = useState(null);

  return (
    <section id="geradores" className="relative mx-auto max-w-7xl scroll-mt-28 px-4 py-12 sm:px-6 sm:py-24">
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
          Clique no card para ver a aplicação típica e solicitar a cotação.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {generatorsByPower.map((generator) => {
            const active = selectedKva === generator.kva;
            const thumb = thumbnailSize(generator.kva);
            return (
              <article
                key={generator.kva}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow ${
                  active
                    ? "col-span-1 border-primary shadow-md sm:col-span-2"
                    : "border-slate-200 hover:border-primary/40"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={active}
                  onClick={() => setSelectedKva(active ? null : generator.kva)}
                  className={`flex min-h-[56px] w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold ${
                    active ? "bg-primary text-white" : "bg-white text-slate-900"
                  }`}
                >
                  <span>{generator.title}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${active ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col items-center gap-4 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-start">
                        <img
                          src={GENERATOR_IMAGE}
                          alt={generator.title}
                          width={thumb}
                          height={thumb}
                          className="shrink-0 object-contain drop-shadow-[0_10px_24px_rgba(11,28,61,0.35)]"
                          style={{
                            width: thumb,
                            height: thumb,
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {generator.kva} kVA
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600">{generator.description}</p>
                          <p className="mt-3 text-sm font-medium text-slate-800">
                            Aplicação típica: {generator.application}
                          </p>
                          <a
                            href={waLink(quoteMessage(generator))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold uppercase text-white hover:bg-[#20bd5a]"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Contratar
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
