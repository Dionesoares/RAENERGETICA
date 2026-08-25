import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { ArrowRight } from "lucide-react";
import { waLink } from "@/lib/whatsapp";
import { base44 } from "@/api/base44Client";

const staticProducts = [
{
  title: "Gerador Diesel 42kVA Aberto",
  img: "https://media.base44.com/images/public/6a7e084b2a4955a8b5e1cb3d/11cf1849a_GERADORDIESEL42kVAABERTO.png",
  text: "Buscando atender as demandas de clientes dos mais variados segmentos, a RA Energética oferece um produto que abrange diferentes níveis de necessidade. Todos os equipamentos são produzidos sob os mais rígidos padrões de qualidade, garantindo plena funcionalidade e elevada durabilidade."
},
{
  title: "Linha Duogen",
  img: "https://media.base44.com/images/public/6a7e084b2a4955a8b5e1cb3d/39d94a803_LinhaDuogen.png",
  text: "Sistema de geração de energia composto de 2 grupos geradores à diesel de 500kVA a 700kVA cada, podendo operar como usina de 1000kVA a 1400kVA em paralelo ou standby. Para cargas críticas, dois grupos geradores em standby oferecem maior flexibilidade de operação com carga total ou reduzida."
},
{
  title: "Gerador a Diesel",
  img: "https://media.base44.com/images/public/6a7e084b2a4955a8b5e1cb3d/79b0327c1_GeradoraDiesel.png",
  text: "Nossos Geradores a Diesel fabricados pela MWM são equipados com motores próprios e de grandes parceiros como Scania, Volvo Penta, MAN e Yanmar. Fabricados para eventos e festas de médio e grande porte, pensados no bem-estar do seu evento ou empreendimento."
},
{
  title: "Mini Gen",
  img: "https://media.base44.com/images/public/6a7e084b2a4955a8b5e1cb3d/b7b6aba9d_Logotiponomeminimalistaembrancoepreto5.png",
  text: "MINI GEN é um equipamento compacto, robusto, com design arrojado, projetado para garantir autonomia energética para o seu negócio ou residência. Tenha o que há de melhor à sua disposição."
}];


export default function Generators() {
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    base44.entities.Product.list("-created_date")
      .then((list) =>
        setDbProducts(list.map((p) => ({ title: p.title, img: p.image_url, text: p.description })))
      )
      .catch(() => setDbProducts([]));
  }, []);

  const products = [...staticProducts, ...dbProducts];

  return (
    <section id="geradores" className="relative mx-auto max-w-7xl px-6 py-14 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-14 max-w-2xl text-center">
        
        
        <h2 className="mt-3 font-heading text-3xl font-extrabold text-primary sm:text-4xl">
          NOSSOS GERADORES
        </h2>
        <p className="mt-4 text-muted-foreground">
          Linha completa de grupos geradores desenvolvida com tecnologia MWM e parceiros
          renomados, nas versões Diesel e Gás.
        </p>
      </motion.div>

      <div className="space-y-8">
        {products.map((p, i) =>
        <motion.article
          key={p.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="group grid items-center gap-8 rounded-3xl border border-border bg-card p-6 shadow-lg shadow-primary/5 transition-all hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 lg:grid-cols-2 lg:p-8">
          
            <div
            className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-secondary/40 ${i % 2 ? "lg:order-2" : ""}`}>
            
              <div className="relative aspect-[4/3] w-full">
                <Image src={p.img} alt={p.title} fittingType="fill" className="h-full w-full transition-transform duration-700 group-hover:scale-105 drop-shadow-2xl" />
              </div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
            </div>
            <div className={i % 2 ? "lg:order-1" : ""}>
              

            
              <h3 className="font-heading text-2xl font-bold text-primary">{p.title}</h3>
              <p className="mt-4 text-muted-foreground">{p.text}</p>
              <a
              href={waLink(`Olá! Tenho interesse no ${p.title}. Pode me enviar mais informações?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent">
              
                Solicitar orçamento
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </a>
            </div>
          </motion.article>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-14 grid gap-6 rounded-3xl bg-primary p-8 text-white sm:grid-cols-2 sm:p-12">
        
        <p className="text-lg font-medium leading-relaxed text-white/90">
          A tradição, a tecnologia e a qualidade dos motores MWM, juntamente com motores de
          alto desempenho e confiabilidade de parceiros renomados, formam a base da linha de
          Grupos Geradores.
        </p>
        <p className="text-lg font-medium leading-relaxed text-white/70">
          Desenvolvidos dentro do Centro Tecnológico da MWM, com as melhores práticas de
          engenharia. Disponíveis nas versões Diesel e Gás, com gama de potências para atender
          às suas necessidades.
        </p>
      </motion.div>
    </section>);

}