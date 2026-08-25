import React from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { CheckCircle2 } from "lucide-react";

const aboutImg = "/about/sobre-nos.jpg";

const points = [
"Geradores de 50 a 500 kVA para eventos de todos os portes",
"Estrutura para shows, espetáculos e eventos empresariais",
"Energia garantida do início ao fim do evento"];


export default function About() {
  return (
    <section id="sobre" className="relative overflow-hidden py-14 sm:py-24">
      <div className="absolute inset-0 grid-lines opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center">
          
          
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-primary sm:text-4xl">SOBRE NÓS</h2>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative">
            
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary/15">
              <div className="aspect-[16/10] w-full">
                <Image src={aboutImg} alt="Estrutura e frota RA Energética" fittingType="fill" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            <div className="glass absolute -bottom-6 -right-4 rounded-2xl px-6 py-4 shadow-xl sm:right-8">
              <div className="font-heading text-3xl font-extrabold text-primary">+10 anos</div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">de experiência</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}>
            
            <p className="text-lg leading-relaxed text-muted-foreground">
              Nós, da <strong className="text-[hsl(var(--secondary-foreground))]">RAENERGÉTICA</strong>, estamos empenhados em
              otimizar a qualidade dos serviços prestados por nossos colaboradores por meio de uma
              abordagem integrada em relação ao profissionalismo e bem-estar. Todas as soluções
              necessárias para estruturar a energia de suporte ao seu evento, seja ele de médio ou
              grande porte, você encontra aqui.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Suas festas e eventos estão garantidos do início ao fim. Nossos geradores variam de
              50 a 500 kVA e são responsáveis pela garantia de energia para eventos de todos os
              portes — desde grandes espetáculos como shows até eventos empresariais com grandes
              estruturas de iluminação.
            </p>

            <ul className="mt-6 space-y-3">
              {points.map((p) =>
              <li key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-foreground/90">{p}</span>
                </li>
              )}
            </ul>

            <blockquote className="mt-8 border-l-4 border-accent pl-5 font-heading text-xl font-semibold text-primary">
              Com modernidade, agilidade e segurança, estruturamos seu evento com "S" de sucesso.
            </blockquote>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-3xl text-center text-lg leading-relaxed text-muted-foreground">
          
          Nosso objetivo é modelar e promover um padrão de profissionalismo e qualidade integrado.
          Conseguimos atingir esse objetivo por meio de nossos valores fundamentais: integração,
          experiência e agilidade. Cada profissional, dos técnicos ao administrativo, dedica-se a
          atender às demandas do seu negócio — damos o nosso melhor para que você tenha uma
          experiência positiva conosco.
        </motion.p>
      </div>
    </section>);

}