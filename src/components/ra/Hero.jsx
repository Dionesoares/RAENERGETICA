import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowDown, Plug } from "lucide-react";
import { Image } from "@/components/ui/image";
import { waLink } from "@/lib/whatsapp";

const heroImg = "https://media.base44.com/images/public/6a7e084b2a4955a8b5e1cb3d/3f01a8ce6_ChatGPTImage17deagode202612_59_25.png";

export default function Hero() {
  const [t, setT] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      setT({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden pt-28">
      {/* background grid + gradient */}
      <div className="absolute inset-0 grid-lines [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />

      {/* animated flow lines */}
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
        <path d="M-100,200 C400,120 700,420 1400,260" fill="none" stroke="hsl(199 89% 48%)" strokeWidth="1" className="animate-flow" />
        <path d="M-100,420 C500,520 800,220 1500,400" fill="none" stroke="hsl(45 96% 61%)" strokeWidth="1" className="animate-flow" />
      </svg>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:py-20">
        {/* copy */}
        <div className="order-2 lg:order-1">
          






          

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            
            <span className="text-gradient-energy">Energia que</span>
            <br />
            <span className="text-primary">Constrói.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground">
            
            Oferecemos serviços especializados na locação de geradores de energia —
            do pequeno evento à grande estrutura industrial, com segurança, agilidade e
            profissionais experientes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-4">
            
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[56px] items-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-[1.03]">
              
              <MessageCircle className="h-5 w-5" />
              Fale Conosco
            </a>
            <a
              href="#geradores"
              className="flex min-h-[56px] items-center gap-2 rounded-full border border-border bg-background/60 px-7 text-base font-semibold text-foreground transition-colors hover:border-accent hover:text-accent">
              
              Nossos Geradores <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        {/* 3D visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: `perspective(1000px) rotateY(${t.x}deg) rotateX(${-t.y}deg)` }}
          className="relative order-1 lg:order-2">
          
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl glass shadow-2xl shadow-primary/20 preserve-3d">
            <Image
              src={heroImg}
              alt="Nó de energia industrial"
              fittingType="fill"
              className="h-full w-full" />
            
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-accent/20" />
            


            
          </div>
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent/30 to-primary/30 blur-2xl" />
        </motion.div>
      </div>
    </section>);

}