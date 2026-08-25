import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, Shield, Zap } from "lucide-react";
import { waLink } from "@/lib/whatsapp";
import { areasOfActivity } from "@/lib/areasOfActivity";

function WhatsAppButton({ message }) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#20bd5a]"
    >
      <MessageCircle className="h-5 w-5" />
      Contato via WhatsApp
    </a>
  );
}

function AreaImage({ src, alt, featured = false }) {
  if (!src) return null;
  return (
    <div className={`overflow-hidden rounded-xl bg-black/40 ${featured ? "ring-1 ring-sky-400/30" : ""}`}>
      <img
        src={src}
        alt={alt}
        className={`mx-auto w-full object-contain object-center ${featured ? "max-h-[28rem] sm:max-h-[32rem]" : "max-h-40 sm:max-h-44"}`}
      />
    </div>
  );
}

export default function AreasOfActivity() {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="atuacao" className="scroll-mt-28 bg-[#070f1c] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl">Áreas de Atuação</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
            Conheça nossos serviços
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areasOfActivity.map((area, index) => {
            const open = openId === area.id;
            const images = [area.image, area.extraImage].filter(Boolean);
            return (
              <article
                key={area.id}
                id={`area-${area.id}`}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-[#0b1c3d] ${
                  open ? "border-sky-400/70" : "border-white/10 hover:border-sky-400/40"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : area.id)}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-400/20 text-xs font-bold text-sky-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-heading text-lg font-bold leading-tight">{area.title}</span>
                    <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wider text-sky-200">
                      {area.kicker}
                    </span>
                  </span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-sky-200 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10 px-4 pb-5 pt-4">
                        {images.length > 0 && (
                          <div className="grid gap-3">
                            {images.map((src) => (
                              <AreaImage key={src} src={src} alt={area.title} featured />
                            ))}
                          </div>
                        )}

                        <p className="mt-4 text-sm text-white/80">{area.subtitle}</p>
                        <p className="mt-2 text-sm leading-relaxed text-white/70">{area.description}</p>

                        {area.groups && (
                          <div className="mt-4 space-y-2">
                            {area.groups.map((group) => (
                              <div key={group.title} className="rounded-xl border border-white/15 bg-white/5 p-3">
                                <h5 className="text-xs font-bold uppercase">{group.title}</h5>
                                <p className="mt-1 text-sm text-white/70">{group.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <ul className="mt-4 space-y-2">
                          {area.features.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm">
                              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        {area.categories && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {area.categories.map((category) => (
                              <span
                                key={category}
                                className="rounded-full border border-sky-400/30 bg-black/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 space-y-1.5">
                          {area.bars.map((bar) => (
                            <div key={bar.label} className="flex items-center gap-2 text-xs text-white/75">
                              <Shield className="h-3.5 w-3.5 shrink-0 text-sky-300" />
                              {bar.label}
                            </div>
                          ))}
                        </div>

                        <p className="mt-3 text-sm font-semibold italic text-sky-200">{area.slogan}</p>

                        <div className="mt-4">
                          <WhatsAppButton
                            message={`Olá! Vim pelo site e quero locação de gerador para ${area.title}.`}
                          />
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
