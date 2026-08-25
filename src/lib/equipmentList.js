export const generatorsByPower = [
  {
    kva: 15,
    title: "Aluguel de gerador 15 kVA",
    description:
      "Compacto e econômico para residências, trailers, pequenos comércios e iluminação de eventos. Ideal quando a carga é pontual e o espaço de instalação é reduzido.",
    application: "Casas, lojas, stands e obras residenciais.",
  },
  {
    kva: 20,
    title: "Aluguel de gerador 20 kVA",
    description:
      "Atende escritórios, comércio de bairro e canteiros leves, com folga para climatização e equipamentos de informática.",
    application: "Escritórios, lojas e obras de pequeno porte.",
  },
  {
    kva: 22,
    title: "Aluguel de gerador 22 kVA",
    description:
      "Potência intermediária para comércios e eventos menores que precisam de estabilidade em iluminação, som e refrigeração.",
    application: "Eventos, padarias e comércio com câmaras frias leves.",
  },
  {
    kva: 28,
    title: "Aluguel de gerador 28 kVA",
    description:
      "Boa autonomia para clínicas, mercearias e obras que somam ferramentas, iluminação e ar-condicionado.",
    application: "Clínicas, mercearias e construção civil.",
  },
  {
    kva: 30,
    title: "Aluguel de gerador 30 kVA",
    description:
      "Versátil para restaurantes, condomínios e eventos médios. Cobre cozinha, som e climatização sem sobrecarregar o equipamento.",
    application: "Restaurantes, condomínios e eventos.",
  },
  {
    kva: 40,
    title: "Aluguel de gerador 40 kVA",
    description:
      "Indicado para supermercados de bairro, galpões e canteiros que já operam com várias máquinas ao mesmo tempo.",
    application: "Comércio, galpões e construção civil.",
  },
  {
    kva: 55,
    title: "Aluguel de gerador 55 kVA",
    description:
      "Suporta indústrias leves, shows regionais e operações com motor de médio porte, bombas e iluminação de palco.",
    application: "Indústria leve, eventos e irrigação.",
  },
  {
    kva: 75,
    title: "Aluguel de gerador 75 kVA",
    description:
      "Potência para obras maiores, hospitais de pequeno porte e estruturas de evento com palco, LED e camarins.",
    application: "Obras, saúde e eventos de médio porte.",
  },
  {
    kva: 83,
    title: "Aluguel de gerador 83 kVA",
    description:
      "Cobre linhas de produção leves, datacenters compactos e grandes festas com reserva de potência para picos.",
    application: "Indústria, TI e grandes eventos.",
  },
  {
    kva: 100,
    title: "Aluguel de gerador 100 kVA",
    description:
      "Referência para hospitais, indústria e eventos de grande porte. Mantém cargas críticas com folga operacional.",
    application: "Hospitais, indústria e shows.",
  },
  {
    kva: 110,
    title: "Aluguel de gerador 110 kVA",
    description:
      "Backup corporativo e shopping de médio porte, com capacidade para climatização central e operação contínua.",
    application: "Shoppings, indústrias e prédios comerciais.",
  },
  {
    kva: 125,
    title: "Aluguel de gerador 125 kVA",
    description:
      "Atende construção pesada, centros de distribuição e eventos com estrutura completa de palco e camarins.",
    application: "Construção pesada, logística e eventos.",
  },
  {
    kva: 140,
    title: "Aluguel de gerador 140 kVA",
    description:
      "Indicada para plantas industriais, hospitais e CDAs que não podem parar em horário de pico ou emergência.",
    application: "Indústria, hospitais e centros de distribuição.",
  },
  {
    kva: 350,
    title: "Aluguel de gerador 350 kVA",
    description:
      "Alta potência para canteiros pesados, mineração e indústrias que concentram motores, compressores e fornos.",
    application: "Mineração, indústria pesada e grandes obras.",
  },
  {
    kva: 450,
    title: "Aluguel de gerador 450 kVA",
    description:
      "Usina temporária para hospitais de referência, indústrias e operações 24h com demanda elevada.",
    application: "Hospitais, indústria e operação contínua.",
  },
  {
    kva: 550,
    title: "Aluguel de gerador 550 kVA",
    description:
      "Para plantas que precisam de energia estável em regime pesado, inclusive horário de ponta e parada programada.",
    application: "Indústria pesada, agroindústria e mineração.",
  },
  {
    kva: 625,
    title: "Aluguel de gerador 625 kVA",
    description:
      "Standby crítico e operação de grandes plantas. Entrega reserva de potência para picos e partidas de motores.",
    application: "Grandes plantas industriais e standby crítico.",
  },
  {
    kva: 670,
    title: "Aluguel de gerador 670 kVA",
    description:
      "Maior potência da linha de locação. Indicada para operação pesada, paralelismo e estruturas que não podem falhar.",
    application: "Indústria de grande porte e usinas temporárias.",
  },
];

export const generatorUseCases = [
  {
    title: "Obra e construção",
    description: "Energia antes da rede definitiva, com potência acompanhando as fases.",
  },
  {
    title: "Safra e agro",
    description: "Secador, armazém e irrigação no período de pico.",
  },
  {
    title: "Parada programada",
    description: "Manutenção da subestação sem parar a produção.",
  },
  {
    title: "Emergência",
    description: "Falha de rede com atendimento imediato.",
  },
  {
    title: "Horário de ponta",
    description: "Gerar mais barato que comprar da rede nas horas caras.",
  },
];

export const defaultEquipmentList = [
  "Gerador Diesel 42kVA Aberto",
  "Linha Duogen",
  "Gerador a Diesel",
  "Mini Gen",
  ...generatorsByPower.map((item) => item.title),
];
