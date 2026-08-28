import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/whatsapp";
import { generatorsByPower, generatorUseCases } from "@/lib/equipmentList";

const quoteMessage = (generator) =>
  `Preciso de um orçamento para esse gerador: ${generator.title}.`;

const GENERATOR_IMAGE = "/geradores/raenergetica-gerador.png";

function imageScale(kva) {
  const minKva = 15;
  const maxKva = 670;
  const minScale = 0.62;
  const maxScale = 0.94;
  const t = (Math.sqrt(kva) - Math.sqrt(minKva)) / (Math.sqrt(maxKva) - Math.sqrt(minKva));
  return minScale + Math.min(1, Math.max(0, t)) * (maxScale - minScale);
}

export default function Generators() {
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
          Veja a aplicação típica de cada potência e solicite a cotação.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {generatorsByPower.map((generator) => {
            const scale = imageScale(generator.kva);
            return (
              <article
                key={generator.kva}
                className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex h-[260px] items-center justify-center px-4 pt-6 sm:h-[280px]">
                  <img
                    src={GENERATOR_IMAGE}
                    alt={generator.title}
                    className="max-h-full object-contain drop-shadow-[0_10px_24px_rgba(11,28,61,0.35)]"
                    style={{ width: `${scale * 100}%` }}
                  />
                </div>
                <div className="flex flex-1 flex-col px-4 pb-5 pt-2">
                  <h4 className="font-heading text-sm font-bold leading-snug text-primary sm:text-[15px]">
                    {generator.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{generator.description}</p>
                  <p className="mt-3 text-sm font-medium text-slate-800">
                    Aplicação típica: {generator.application}
                  </p>
                  <a
                    href={waLink(quoteMessage(generator))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold uppercase text-white hover:bg-[#20bd5a]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contratar
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
