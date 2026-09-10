import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { COMPANY_EMAILS } from "@/lib/company";

const STORAGE_KEY = "raenergetica_lgpd_consent";
const OPEN_EVENT = "ra:open-lgpd";

export function openLgpdPopup() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export default function LgpdPopup() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }

    const onOpen = () => {
      setOpen(true);
      setDetails(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const save = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore quota / private mode */
    }
    setOpen(false);
    setDetails(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:items-center sm:pb-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-label="Fechar aviso de proteção de dados"
        onClick={() => save("essential")}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lgpd-title"
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/10 sm:p-7"
      >
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 id="lgpd-title" className="font-heading text-lg font-extrabold text-primary sm:text-xl">
              Proteção de Dados — LGPD
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A RA Energética trata dados pessoais com segurança e transparência, em conformidade com a
              Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/80">
          Utilizamos cookies e informações de contato apenas para melhorar sua experiência, atender
          solicitações comerciais e prestar nossos serviços de locação de geradores.
        </p>

        {details && (
          <div className="mt-4 space-y-2 rounded-xl bg-secondary/80 p-4 text-sm text-foreground/80">
            <p>
              <strong className="text-primary">Dados:</strong> nome, telefone, e-mail e dados de navegação
              quando você nos contata ou navega no site.
            </p>
            <p>
              <strong className="text-primary">Finalidade:</strong> orçamentos, atendimento, segurança do
              site e cumprimento de obrigações legais.
            </p>
            <p>
              <strong className="text-primary">Seus direitos:</strong> acesso, correção, exclusão,
              portabilidade e revogação do consentimento, conforme a LGPD.
            </p>
            <p>
              <strong className="text-primary">Contato:</strong>{" "}
              <a href={`mailto:${COMPANY_EMAILS.comercial}`} className="font-medium text-accent hover:underline">
                {COMPANY_EMAILS.comercial}
              </a>
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
            onClick={() => setDetails((value) => !value)}
          >
            {details ? "Ocultar detalhes" : "Saiba mais sobre a LGPD"}
          </button>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => save("essential")}
              className="rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Recusar
            </button>
            <button
              type="button"
              onClick={() => save("accepted")}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-transform hover:scale-[1.02]"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
