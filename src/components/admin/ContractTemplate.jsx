import React from "react";
import { format } from "date-fns";
import { defaultContractText } from "@/lib/contractClauses";
import { COMPANY_ADDRESS } from "@/lib/company";
import { SITE_LOGO_SRC } from "@/components/ra/Logo";

const fmt = (d) => (d ? format(new Date(d), "dd/MM/yyyy") : "____/____/______");
const money = (v) => (v ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0,00");
const today = format(new Date(), "dd 'de' MMMM 'de' yyyy");
const NAVY = "#1B2C54";
const LOGO_FILTER =
  "brightness(0) saturate(100%) invert(13%) sepia(42%) saturate(1486%) hue-rotate(196deg) brightness(92%) contrast(95%)";

const COMPANY = {
  name: "RA ENERGÉTICA GERADORES LTDA",
  cnpj: "02.255.526/0001-48",
  address: COMPANY_ADDRESS,
  phone: "(63) 99993-8060",
  email: "comercial@raenergetica.com.br",
  rep: "RICARDO AGRELI",
  repCpf: "090.065.018-40",
};

function SiteLogo({ size = "sm" }) {
  const icon = size === "watermark" ? "h-44 w-44" : "h-11 w-11";
  const name = size === "watermark" ? "text-5xl" : "text-[22px]";
  const subtitle = size === "watermark" ? "text-sm tracking-[0.18em]" : "text-[8px] tracking-[0.14em]";

  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={SITE_LOGO_SRC}
        alt="RA Energética"
        crossOrigin="anonymous"
        className={`${icon} object-contain`}
        style={{ filter: LOGO_FILTER }}
      />
      <span className="inline-flex flex-col leading-none">
        <span
          className={`block font-extrabold italic tracking-tight ${name}`}
          style={{ fontFamily: "Arial, sans-serif", color: NAVY }}
        >
          RAENERGÉTICA
        </span>
        <span
          className={`block text-center font-bold uppercase ${subtitle}`}
          style={{ fontFamily: "Arial, sans-serif", color: NAVY }}
        >
          Geradores
        </span>
      </span>
    </span>
  );
}

export default function ContractTemplate({ client, contract, id = "contract-template" }) {
  if (!client) return null;
  const isPj = client.type === "pj";

  return (
    <div
      id={id}
      className="relative mx-auto overflow-hidden bg-white text-slate-800"
      style={{ width: "210mm", minHeight: "297mm", padding: "9mm 11mm", fontSize: "8px", lineHeight: 1.28 }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
        <div className="origin-center scale-125 opacity-[0.07]">
          <SiteLogo size="watermark" />
        </div>
      </div>

      <div className="relative">
        <header className="mb-3 flex items-center justify-between border-b-2 border-[#1B2C54] pb-2">
          <SiteLogo />
          <div className="max-w-[58%] text-right text-[7.5px] leading-snug text-slate-500">
            <p className="font-semibold text-slate-700">{COMPANY.name}</p>
            <p>CNPJ: {COMPANY.cnpj}</p>
            <p>{COMPANY.address}</p>
            <p>{COMPANY.phone} • {COMPANY.email}</p>
          </div>
        </header>

        <h1 className="mb-0.5 text-center text-[11px] font-bold uppercase leading-tight text-[#1B2C54]">
          Contrato de Locação de Grupo Gerador com Prestação de Serviços Técnicos Acessórios
        </h1>
        <p className="mb-2.5 text-center text-[8px] text-slate-500">Contrato Nº {contract.contract_number || "____"}</p>

        <p className="mb-1.5 text-justify">
          Pelo presente instrumento particular, de um lado, <strong>{COMPANY.name}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {COMPANY.cnpj}, com sede na {COMPANY.address}, telefone/WhatsApp {COMPANY.phone}, e-mail: {COMPANY.email}, neste ato representada por seu sócio administrador {COMPANY.rep}, inscrito no CPF: {COMPANY.repCpf}, doravante denominada simplesmente <strong>LOCADORA</strong>;
        </p>
        <p className="mb-1.5 text-justify">
          e, de outro lado, <strong>{client.name}</strong>, {isPj ? "pessoa jurídica" : "pessoa física"}, inscrito(a) no {isPj ? "CNPJ" : "CPF"} sob o nº {client.document || "[PREENCHER]"}, com endereço na {client.address || "[PREENCHER]"}{client.city ? `, ${client.city}` : ""}{client.state ? `/${client.state}` : ""}, telefone/WhatsApp nº {client.phone || "[PREENCHER]"}, e-mail {client.email || "[PREENCHER]"}
          {isPj && client.contact_person ? `, neste ato representado(a) por ${client.contact_person}` : ""}, doravante denominado(a) simplesmente <strong>LOCATÁRIO</strong>;
        </p>
        <p className="mb-2.5 text-justify">
          têm entre si justo e contratado o presente Contrato de Locação de Grupo Gerador com Prestação de Serviços Técnicos Acessórios, mediante as cláusulas seguintes:
        </p>

        <div className="mb-2.5 rounded border border-slate-300 bg-slate-50/80 px-3 py-2">
          <h2 className="mb-1 text-[8px] font-bold uppercase text-[#1B2C54]">Quadro-Resumo</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            <p><strong>Equipamento:</strong> {contract.equipment || "____"}</p>
            <p><strong>Valor total:</strong> {money(contract.value)}</p>
            <p><strong>Início:</strong> {fmt(contract.start_date)}</p>
            <p><strong>Término:</strong> {fmt(contract.end_date)}</p>
            <p className="col-span-2"><strong>Condições de pagamento:</strong> {contract.payment_terms || "a combinar"}</p>
            {contract.notes && <p className="col-span-2"><strong>Observações:</strong> {contract.notes}</p>}
          </div>
        </div>

        <div className="mb-2 columns-2 gap-x-4 whitespace-pre-wrap text-justify [column-fill:auto]">
          {contract.content ?? defaultContractText}
        </div>

        <p className="mb-1.5 text-justify">
          E por estarem de acordo com todas as cláusulas e condições ora estipuladas, as partes firmam o presente contrato.
        </p>
        <p className="mb-4 text-center">Palmas/TO, {today}.</p>

        <div className="mb-3 grid grid-cols-2 gap-8 text-center">
          <div>
            <div className="mb-0.5 border-t border-slate-400 pt-1 font-semibold">{COMPANY.name}</div>
            <p className="text-[7.5px] text-slate-500">LOCADORA • CNPJ nº {COMPANY.cnpj}</p>
          </div>
          <div>
            <div className="mb-0.5 border-t border-slate-400 pt-1 font-semibold">{client.name}</div>
            <p className="text-[7.5px] text-slate-500">LOCATÁRIO • {isPj ? "CNPJ" : "CPF"} nº {client.document || "[PREENCHER]"}</p>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-8">
          <div>
            <p className="mb-3 font-semibold text-slate-600">1ª Testemunha</p>
            <p>Nome: ______________________________</p>
            <p>CPF: ______________________________</p>
          </div>
          <div>
            <p className="mb-3 font-semibold text-slate-600">2ª Testemunha</p>
            <p>Nome: ______________________________</p>
            <p>CPF: ______________________________</p>
          </div>
        </div>

        <footer className="border-t border-[#1B2C54] pt-1.5 text-center text-[7px] text-slate-500">
          <p>{COMPANY.address} • {COMPANY.phone} • {COMPANY.email}</p>
          <p>CNPJ: {COMPANY.cnpj} — Documento gerado em {fmt(new Date())}</p>
        </footer>
      </div>
    </div>
  );
}
