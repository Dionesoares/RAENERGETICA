import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

export default function Partners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    let active = true;
    base44.entities.Partner.list("sort_order")
      .then((list) => {
        if (!active) return;
        setPartners((list || []).filter((partner) => partner.active !== false && partner.logo_url));
      })
      .catch(() => {
        if (active) setPartners([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="parceiros" className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
      <div className="absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">NOSSOS PARCEIROS</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Empresas e instituições que caminham com a RA Energética.
          </p>
        </motion.div>

        {partners.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Em breve, os logos e as mensagens dos nossos parceiros aparecerão aqui.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner, index) => (
              <motion.article
                key={partner.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                className="flex flex-col items-center rounded-3xl border border-primary/10 bg-white px-6 py-8 shadow-sm"
              >
                <div className="flex h-28 w-full items-center justify-center">
                  <img
                    src={partner.logo_url}
                    alt={partner.name || "Parceiro RA Energética"}
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
                {partner.name && (
                  <h3 className="mt-5 text-center font-heading text-base font-bold text-primary">
                    {partner.name}
                  </h3>
                )}
                {partner.message && (
                  <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
                    {partner.message}
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
