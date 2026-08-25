import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

const MAP_QUERY = encodeURIComponent("Quadra Alc-so 141 Mirante do Lago Alameda Cerejeira Plano Diretor Sul Palmas TO");

export default function Contact() {

  return (
    <section id="contato" className="relative overflow-hidden bg-secondary/50 py-14 sm:py-24">
      <div className="absolute inset-0 grid-lines opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center">
          
          
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-primary sm:text-4xl">CONTATO</h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center">
            
            <div className="rounded-3xl bg-card p-8 shadow-xl shadow-primary/5 sm:p-10">
              <h3 className="font-heading text-2xl font-bold text-primary">Vamos conversar</h3>
              <p className="mt-2 text-muted-foreground">
                Solicite um orçamento ou tire dúvidas sobre locação de geradores.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Endereço</div>
                    <p className="mt-1 font-medium text-foreground">
                      Quadra Alc-so 141 — Mirante do Lago, Alameda Cerejeira, Plano Diretor Sul
                      <br /> Palmas, TO — CEP: 77.019-876 — Brasil
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mails</div>
                    <p className="mt-1 font-medium text-foreground">
                      <a href="mailto:comercial@raenergetica.com.br" className="hover:text-accent">comercial@raenergetica.com.br</a><br />
                      <a href="mailto:producao@raenergetica.com.br" className="hover:text-accent">producao@raenergetica.com.br</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Comercial</div>
                    <p className="mt-1 font-medium text-foreground">(63) 99911-8060</p>
                  </div>
                </div>
              </div>

              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02]">
                
                <MessageCircle className="h-5 w-5" /> Falar no WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl shadow-xl shadow-primary/10 ring-1 ring-border">
            
            <div className="h-full min-h-[420px] w-full">
              <iframe
                title="Mapa RA Energética"
                src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
                className="h-full min-h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" />
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}