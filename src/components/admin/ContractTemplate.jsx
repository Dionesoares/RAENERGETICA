import React from "react";
import { format } from "date-fns";
import { defaultContractText } from "@/lib/contractClauses";

const fmt = (d) => (d ? format(new Date(d), "dd/MM/yyyy") : "____/____/______");
const money = (v) => (v ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0,00");
const today = format(new Date(), "dd 'de' MMMM 'de' yyyy");

const COMPANY = {
  name: "RA ENERGÉTICA GERADORES LTDA",
  cnpj: "02.255.526/0001-48",
  address: "Rodovia TO 050, KM 05, Quadra 06, Lote 16, Zona Rural, Palmas/TO, CEP: 77064-596",
  phone: "(63) 99993-8060",
  email: "comercial@raenergetica.com.br",
  rep: "RICARDO AGRELI",
  repCpf: "090.065.018-40",
};

function Logo({ withSubtitle = false }) {
  return (
    <span className="inline-flex items-center gap-1">
      <img
        src="https://media.base44.com/images/public/6a7e084b2a4955a8b5e1cb3d/2945aa2a0_ChatGPT_Image_15_de_ago_de_2026__18_55_22-removebg-preview.png"
        alt="RA Energética"
        className="h-9 w-9"
      />
      <span className="inline-block text-center">
        <span className="block text-2xl font-extrabold italic leading-none" style={{ fontFamily: "Arial, sans-serif" }}>
          <span style={{ color: "#1E2A47" }}>RA</span>
          <span style={{ color: "#E3231C" }}>ENERGÉTICA</span>
        </span>
        {withSubtitle && (
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Locações &amp; Eventos</span>
        )}
      </span>
    </span>
  );
}

export default function ContractTemplate({ client, contract, id = "contract-template" }) {
  if (!client) return null;
  const isPj = client.type === "pj";

  return (
    <div id={id} className="mx-auto w-full max-w-[780px] bg-white p-10 text-[12.5px] leading-relaxed text-slate-800">
      {/* CABEÇALHO */}
      <header className="mb-8 flex items-center justify-between border-b-4 border-[#1E3FCC] pb-4">
        <div>
          <Logo withSubtitle />
        </div>
        <div className="text-right text-[10px] leading-snug text-slate-500">
          <p className="font-semibold text-slate-600">{COMPANY.name}</p>
          <p>CNPJ: {COMPANY.cnpj}</p>
          <p>{COMPANY.address}</p>
          <p>{COMPANY.phone} • {COMPANY.email}</p>
        </div>
      </header>

      <h1 className="mb-1 text-center text-base font-bold uppercase text-[#1E3FCC]">
        Contrato de Locação de Grupo Gerador com Prestação de Serviços Técnicos Acessórios
      </h1>
      <p className="mb-6 text-center text-xs text-slate-500">Contrato Nº {contract.contract_number || "____"}</p>

      {/* QUALIFICAÇÃO DAS PARTES */}
      <p className="mb-3 text-justify">
        Pelo presente instrumento particular, de um lado, <strong>{COMPANY.name}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {COMPANY.cnpj}, com sede na {COMPANY.address}, telefone/WhatsApp {COMPANY.phone}, e-mail: {COMPANY.email}, neste ato representada por seu sócio administrador {COMPANY.rep}, inscrito no CPF: {COMPANY.repCpf}, doravante denominada simplesmente <strong>LOCADORA</strong>;
      </p>
      <p className="mb-3 text-justify">
        e, de outro lado, <strong>{client.name}</strong>, {isPj ? "pessoa jurídica" : "pessoa física"}, inscrito(a) no {isPj ? "CNPJ" : "CPF"} sob o nº {client.document || "[PREENCHER]"}, com endereço na {client.address || "[PREENCHER]"}{client.city ? `, ${client.city}` : ""}{client.state ? `/${client.state}` : ""}, telefone/WhatsApp nº {client.phone || "[PREENCHER]"}, e-mail {client.email || "[PREENCHER]"}
        {isPj && client.contact_person ? `, neste ato representado(a) por ${client.contact_person}` : ""}, doravante denominado(a) simplesmente <strong>LOCATÁRIO</strong>;
      </p>
      <p className="mb-6 text-justify">
        têm entre si justo e contratado o presente Contrato de Locação de Grupo Gerador com Prestação de Serviços Técnicos Acessórios, mediante as cláusulas seguintes:
      </p>

      {/* QUADRO-RESUMO */}
      <div className="mb-6 rounded-lg border border-slate-300 bg-slate-50 p-4">
        <h2 className="mb-2 text-xs font-bold uppercase text-[#1E3FCC]">Quadro-Resumo</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <p><strong>Equipamento:</strong> {contract.equipment || "____"}</p>
          <p><strong>Valor total:</strong> {money(contract.value)}</p>
          <p><strong>Início:</strong> {fmt(contract.start_date)}</p>
          <p><strong>Término:</strong> {fmt(contract.end_date)}</p>
          <p className="col-span-2"><strong>Condições de pagamento:</strong> {contract.payment_terms || "a combinar"}</p>
          {contract.notes && <p className="col-span-2"><strong>Observações:</strong> {contract.notes}</p>}
        </div>
      </div>

      {/* TEXTO DO CONTRATO (livre para edição) */}
      <div className="mb-6 whitespace-pre-wrap text-justify">
        {contract.content ?? defaultContractText}
      </div>

      <p className="mb-8 mt-6 text-justify">
        E por estarem de acordo com todas as cláusulas e condições ora estipuladas, as partes firmam o presente contrato.
      </p>
      <p className="mb-10 text-center">Palmas/TO, {today}.</p>

      {/* CAMPO DE ASSINATURA */}
      <div className="mb-10 grid grid-cols-2 gap-8 text-center">
        <div>
          <div className="mb-1 border-t border-slate-400 pt-2 font-semibold">{COMPANY.name}</div>
          <p className="text-xs text-slate-500">LOCADORA</p>
          <p className="text-xs text-slate-500">CNPJ nº {COMPANY.cnpj}</p>
        </div>
        <div>
          <div className="mb-1 border-t border-slate-400 pt-2 font-semibold">{client.name}</div>
          <p className="text-xs text-slate-500">LOCATÁRIO</p>
          <p className="text-xs text-slate-500">{isPj ? "CNPJ" : "CPF"} nº {client.document || "[PREENCHER]"}</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-8 text-xs">
        <div>
          <p className="mb-6 font-semibold text-slate-600">1ª Testemunha</p>
          <p>Nome: ______________________________</p>
          <p>CPF: ______________________________</p>
        </div>
        <div>
          <p className="mb-6 font-semibold text-slate-600">2ª Testemunha</p>
          <p>Nome: ______________________________</p>
          <p>CPF: ______________________________</p>
        </div>
      </div>

      {/* RODAPÉ */}
      <footer className="mt-10 border-t-2 border-[#1E3FCC] pt-4 text-center">
        <div className="flex justify-center">
          <Logo withSubtitle />
        </div>
        <p className="mt-1 text-[10px] text-slate-500">
          {COMPANY.address} • {COMPANY.phone} • {COMPANY.email}
        </p>
        <p className="mt-1 text-[10px] text-slate-400">CNPJ: {COMPANY.cnpj} — Documento gerado em {fmt(new Date())}</p>
      </footer>
    </div>
  );
}