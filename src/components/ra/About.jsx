import React from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { CheckCircle2, Eye, Gem, Target } from "lucide-react";

const aboutImg = "/about/sobre-nos.jpg";

const points = [
  "Geradores de 50 a 500 kVA para eventos de todos os portes",
  "Estrutura para shows, espetáculos e eventos empresariais",
  "Energia garantida do início ao fim do evento",
];

const pillars = [
  {
    icon: Target,
    title: "Missão",
    text: "Entregar soluções eficientes e inovadoras que geram valor e resultados para nossos clientes.",
  },
  {
    icon: Eye,
    title: "Visão",
    text: "Ser referência no mercado de locação de geradores, reconhecida pela excelência, confiança e profissionalismo.",
  },
  {
    icon: Gem,
    title: "Valores",
    text: "Ética, inovação, compromisso com resultados, respeito às pessoas e foco no cliente.",
  },
];

const objectives = [
  "Expandir nossa presença no mercado.",
  "Aumentar os resultados e a satisfação dos clientes.",
  "Otimizar processos e garantir eficiência.",
];


export default function About() {
  return (
    <section id="sobre" className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
      <div className="absolute inset-0 grid-lines opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
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
            <div className="glass absolute -bottom-4 right-3 rounded-2xl px-4 py-3 shadow-xl sm:-bottom-6 sm:right-8 sm:px-6 sm:py-4">
              <div className="font-heading text-3xl font-extrabold text-primary">+10 anos</div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">de experiência</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}>
            
            <p className="text-justify text-base leading-relaxed text-muted-foreground sm:text-lg">
              Nós, da <strong className="text-[hsl(var(--secondary-foreground))]">RAENERGÉTICA</strong>, estamos empenhados em
              otimizar a qualidade dos serviços prestados por nossos colaboradores por meio de uma
              abordagem integrada em relação ao profissionalismo e bem-estar. Todas as soluções
              necessárias para estruturar a energia de suporte ao seu evento, seja ele de médio ou
              grande porte, você encontra aqui.
            </p>
            <p className="mt-4 text-justify text-base leading-relaxed text-muted-foreground sm:text-lg">
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
          className="mx-auto mt-16 max-w-3xl text-justify text-base leading-relaxed text-muted-foreground sm:text-lg">
          Nosso objetivo é modelar e promover um padrão de profissionalismo e qualidade integrado.
          Conseguimos atingir esse objetivo por meio de nossos valores fundamentais: integração,
          experiência e agilidade. Cada profissional, dos técnicos ao administrativo, dedica-se a
          atender às demandas do seu negócio — damos o nosso melhor para que você tenha uma
          experiência positiva conosco.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-3xl border border-primary/10 bg-white px-4 py-10 shadow-sm sm:px-8 sm:py-12"
        >
          <div className="grid gap-10 md:grid-cols-3 md:gap-0">
            {pillars.map((item, index) => (
              <div
                key={item.title}
                className={`px-2 text-center md:px-8 ${
                  index > 0 ? "md:border-l md:border-primary/15" : ""
                }`}
              >
                <item.icon className="mx-auto h-12 w-12 text-primary" strokeWidth={1.5} />
                <h3 className="mt-4 font-heading text-xl font-extrabold uppercase tracking-wide text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 overflow-hidden rounded-3xl border border-primary/10 bg-white px-4 py-10 shadow-sm sm:px-8 sm:py-12"
        >
          <h3 className="text-center font-heading text-2xl font-extrabold uppercase tracking-wide text-primary sm:text-3xl">
            Nossos Objetivos
          </h3>
          <div className="mx-auto mt-2 h-px w-24 bg-primary" />
          <div className="mt-8 grid items-center gap-8 md:grid-cols-[160px_1fr]">
            <Target className="mx-auto h-24 w-24 text-primary" strokeWidth={1.4} />
            <ul className="space-y-4">
              {objectives.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-base text-slate-700 sm:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}