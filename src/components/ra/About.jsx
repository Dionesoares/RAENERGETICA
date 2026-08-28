import React from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { CheckCircle2, Eye, Gem, Target } from "lucide-react";

const aboutImg = "/about/sobre-nos.jpg";

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

const sectors = [
  {
    title: "Indústrias e empresas",
    text: "locação de geradores para continuidade de processos produtivos, paradas programadas, manutenção elétrica, expansão de unidades, contingência e falta de energia da concessionária.",
  },
  {
    title: "Agronegócio",
    text: "energia para fazendas, silos, armazéns, secadores, sistemas de irrigação, unidades de beneficiamento e operações durante os períodos críticos da safra.",
  },
  {
    title: "Hospitais e clínicas",
    text: "soluções de energia de contingência para ambientes que exigem alta disponibilidade, confiabilidade e rapidez no atendimento.",
  },
  {
    title: "Shows e grandes eventos",
    text: "geração de energia para palcos, iluminação, sonorização, painéis de LED, estruturas de produção, eventos empresariais, feiras e grandes espetáculos.",
  },
  {
    title: "Obras e construção civil",
    text: "fornecimento temporário de energia para canteiros de obras, equipamentos, ferramentas e estruturas enquanto a rede elétrica definitiva ainda não está disponível.",
  },
  {
    title: "Supermercados, condomínios e estabelecimentos comerciais",
    text: "energia de suporte para preservar a continuidade das operações, sistemas essenciais, refrigeração e infraestrutura.",
  },
];

function Heading({ children }) {
  return (
    <h3 className="mt-10 text-left font-heading text-xl font-extrabold text-primary sm:text-2xl">
      {children}
    </h3>
  );
}

function Paragraph({ children, className = "" }) {
  return (
    <p className={`mt-4 text-justify text-base leading-relaxed text-muted-foreground sm:text-lg ${className}`}>
      {children}
    </p>
  );
}

export default function About() {
  return (
    <section id="sobre" className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
      <div className="absolute inset-0 grid-lines opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-primary sm:text-4xl">SOBRE NÓS</h2>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
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
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-left font-heading text-2xl font-extrabold text-primary sm:text-3xl">
              Energia que mantém o seu negócio em movimento
            </h3>
            <Paragraph className="mt-5">
              A <strong className="text-foreground">RAENERGÉTICA GERADORES</strong> é especializada em locação e aluguel de grupos geradores, oferecendo soluções de energia temporária, emergencial e programada para empresas e operações que não podem parar.
            </Paragraph>
            <Paragraph>
              Estamos sediados em Palmas, capital do Tocantins e a mais jovem capital brasileira, em uma posição estratégica para atender projetos no Tocantins e expandir nossas operações para Pará, Piauí e Maranhão.
            </Paragraph>
            <Paragraph>
              Mais do que disponibilizar equipamentos, entregamos uma solução completa em geração de energia, com planejamento, dimensionamento da potência, instalação, suporte técnico e acompanhamento da operação de acordo com as necessidades de cada cliente.
            </Paragraph>
          </motion.div>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <Heading>Locação de geradores para operações que não podem parar</Heading>
          <Paragraph>
            Nossa estrutura foi desenvolvida para atender desde demandas temporárias até operações críticas e projetos de maior porte. Trabalhamos com geradores de diferentes potências e configurações, possibilitando dimensionar a solução de acordo com a carga, o período de utilização e as características de cada operação.
          </Paragraph>
          <p className="mt-6 text-left text-base font-semibold text-foreground sm:text-lg">Atuamos especialmente em:</p>
          <ul className="mt-4 space-y-3">
            {sectors.map((item) => (
              <li key={item.title} className="text-justify text-base leading-relaxed text-muted-foreground sm:text-lg">
                <strong className="text-foreground">{item.title}</strong> — {item.text}
              </li>
            ))}
          </ul>

          <Heading>Referência em locação e aluguel de energia</Heading>
          <Paragraph>
            Na RAENERGÉTICA, nosso negócio é fazer com que a energia esteja disponível exatamente quando o cliente precisa.
          </Paragraph>
          <Paragraph>
            Por isso, buscamos ser uma referência regional em aluguel e locação de geradores, combinando equipamentos preparados para diferentes aplicações com atendimento ágil e suporte especializado.
          </Paragraph>
          <Paragraph>
            Seja para algumas horas, dias, meses ou para contratos de maior duração, desenvolvemos soluções adequadas à necessidade de cada projeto.
          </Paragraph>
          <Paragraph>
            Energia emergencial. Energia temporária. Energia programada. Energia para operações críticas.
          </Paragraph>
          <Paragraph>
            Tudo com um único objetivo: manter a operação do cliente funcionando.
          </Paragraph>

          <Heading>Energia para a indústria</Heading>
          <Paragraph>
            Uma interrupção de energia pode significar perda de produção, paralisação de máquinas, comprometimento de processos e aumento dos custos operacionais.
          </Paragraph>
          <Paragraph>
            A RAENERGÉTICA fornece grupos geradores para indústrias, empresas e centros operacionais, oferecendo suporte em situações emergenciais, manutenções programadas, ampliações de capacidade e períodos em que a rede convencional não consegue atender à demanda.
          </Paragraph>

          <Heading>Energia que move o agronegócio</Heading>
          <Paragraph>
            O agro trabalha com tempo, produtividade e continuidade.
          </Paragraph>
          <Paragraph>
            Nossas soluções de locação de geradores atendem fazendas, silos, secadores, armazéns, irrigação, processamento e estruturas agrícolas, principalmente nos períodos em que uma interrupção elétrica pode comprometer toda uma operação.
          </Paragraph>
          <Paragraph>
            Do campo ao armazenamento, a RAENERGÉTICA leva energia para onde o agro precisa produzir.
          </Paragraph>

          <Heading>Energia para hospitais e clínicas</Heading>
          <Paragraph>
            Em ambientes de saúde, disponibilidade de energia é essencial.
          </Paragraph>
          <Paragraph>
            Por isso, oferecemos soluções para hospitais, clínicas, laboratórios e outras estruturas de atendimento, proporcionando geração auxiliar para situações programadas ou emergenciais.
          </Paragraph>
          <Paragraph>
            Nosso compromisso é contribuir para que instalações essenciais possam manter suas operações mesmo diante de interrupções no fornecimento convencional.
          </Paragraph>

          <Heading>Energia para shows e grandes eventos</Heading>
          <Paragraph>
            Um grande evento depende de uma infraestrutura elétrica planejada para funcionar do início ao fim.
          </Paragraph>
          <Paragraph>
            A RAENERGÉTICA oferece locação de geradores para shows, festivais, feiras, eventos corporativos, celebrações e grandes produções, fornecendo energia para iluminação, som, palcos, painéis de LED e demais estruturas técnicas.
          </Paragraph>
          <Paragraph>
            Do primeiro teste de iluminação ao encerramento do evento, a energia precisa estar presente.
          </Paragraph>

          <Heading>Tocantins, Pará, Piauí e Maranhão</Heading>
          <Paragraph>
            A partir de Palmas–TO, estamos estrategicamente posicionados para atender clientes e projetos em diferentes regiões.
          </Paragraph>
          <Paragraph>
            Nossa área de atuação contempla especialmente:
          </Paragraph>
          <p className="mt-4 text-center font-heading text-lg font-bold text-primary sm:text-xl">
            Tocantins • Pará • Piauí • Maranhão
          </p>
          <Paragraph>
            Essa localização nos permite atender importantes corredores do agronegócio, indústria, construção, comércio, saúde e eventos, oferecendo soluções de geração de energia adaptadas às características de cada operação.
          </Paragraph>

          <Heading>Nosso compromisso</Heading>
          <Paragraph>
            Profissionalismo, segurança, agilidade, experiência e qualidade orientam o trabalho da RAENERGÉTICA.
          </Paragraph>
          <Paragraph>
            Cada projeto é analisado de acordo com sua necessidade. Nossa equipe trabalha para proporcionar uma experiência completa, desde a identificação da demanda até a disponibilização da solução de energia.
          </Paragraph>
          <Paragraph>
            Não queremos ser apenas uma empresa que entrega um gerador.
          </Paragraph>
          <Paragraph>
            Queremos ser o parceiro de energia que o cliente procura quando sua operação não pode parar.
          </Paragraph>
        </motion.article>

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
                <p className="mt-3 text-justify text-sm leading-relaxed text-slate-600 sm:text-base">{item.text}</p>
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
                  <span className="text-justify text-base text-slate-700 sm:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
