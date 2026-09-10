import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import Header from "@/components/ra/Header";
import Footer from "@/components/ra/Footer";
import MobileTabBar from "@/components/ra/MobileTabBar";
import LgpdPopup from "@/components/ra/LgpdPopup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { generatorsByPower } from "@/lib/equipmentList";
import { COMPANY_EMAILS, COMPANY_PHONES } from "@/lib/company";
import { waLinkTo } from "@/lib/whatsapp";

const emptyForm = {
  name: "",
  company_name: "",
  document: "",
  phone: "",
  email: "",
  generator: "",
  message: "",
};

export default function Quote() {
  const [params] = useSearchParams();
  const preselected = useMemo(() => {
    const kva = Number(params.get("gerador"));
    const match = generatorsByPower.find((item) => item.kva === kva);
    return match?.title || "";
  }, [params]);

  const [form, setForm] = useState({ ...emptyForm, generator: preselected });
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (preselected) setForm((current) => ({ ...current, generator: preselected }));
  }, [preselected]);

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.generator || !form.message.trim()) {
      setFormError("Preencha os campos obrigatórios.");
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }

    setSending(true);
    setFormError("");
    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error("Serviço de orçamento indisponível no momento.");
      }
      const { error } = await supabase.from("quote_requests").insert({
        name: form.name.trim(),
        company_name: form.company_name.trim() || null,
        document: form.document.trim() || null,
        phone: form.phone.trim(),
        email: form.email.trim(),
        generator: form.generator,
        message: form.message.trim(),
        status: "nova",
      });
      if (error) throw error;
      toast({ title: "Solicitação enviada", description: "Em breve a equipe comercial retorna o contato." });
      setForm({ ...emptyForm });
    } catch (error) {
      const description = "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.";
      setFormError(description);
      toast({
        title: "Não foi possível enviar o orçamento",
        description: error?.message || description,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen max-w-full overflow-x-hidden bg-background pb-16 pt-[var(--site-header-height,7.5rem)] md:pb-0">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Orçamento</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-primary sm:text-4xl">
            Solicite um orçamento
          </h1>
          <p className="mt-3 text-muted-foreground">
            Informe seus dados, escolha o gerador e descreva o serviço. Nossa equipe comercial retorna com a cotação.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-white p-5 shadow-xl shadow-primary/5 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" value={form.name} onChange={setField("name")} className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="company_name">Nome da empresa</Label>
                <Input id="company_name" value={form.company_name} onChange={setField("company_name")} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="document">CNPJ / CPF</Label>
                <Input id="document" value={form.document} onChange={setField("document")} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input id="phone" value={form.phone} onChange={setField("phone")} className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" value={form.email} onChange={setField("email")} className="mt-1.5" required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="generator">Gerador *</Label>
                <select
                  id="generator"
                  value={form.generator}
                  onChange={setField("generator")}
                  required
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Selecione um gerador</option>
                  {generatorsByPower.map((item) => (
                    <option key={item.kva} value={item.title}>
                      {item.title} — {item.application}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={setField("message")}
                  className="mt-1.5 min-h-[140px]"
                  placeholder="Descreva o serviço ou o orçamento que você precisa."
                  required
                />
              </div>
            </div>

            {formError && (
              <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{formError}</p>
            )}

            <Button type="submit" disabled={sending} className="mt-6 h-12 w-full rounded-full text-base">
              <Send className="mr-2 h-4 w-4" />
              {sending ? "Enviando..." : "Enviar solicitação"}
            </Button>
          </form>

          <aside className="rounded-3xl bg-primary p-6 text-white sm:p-8">
            <h2 className="font-heading text-xl font-bold">Fale com a RA Energética</h2>
            <p className="mt-2 text-sm text-white/70">
              Prefere atendimento direto? Use os canais comerciais abaixo.
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <a href={`mailto:${COMPANY_EMAILS.comercial}`} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-inset ring-white/15 hover:bg-white/15">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  <span className="block text-xs uppercase tracking-wide text-white/60">E-mail comercial</span>
                  <span className="break-all font-semibold">{COMPANY_EMAILS.comercial}</span>
                </span>
              </a>

              <a
                href={waLinkTo(COMPANY_PHONES.comercial.tel, "Olá! Gostaria de solicitar um orçamento de gerador.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-inset ring-white/15 hover:bg-white/15"
              >
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  <span className="block text-xs uppercase tracking-wide text-white/60">Telefone comercial — WhatsApp</span>
                  <span className="font-semibold">{COMPANY_PHONES.comercial.display}</span>
                </span>
              </a>

              <a href={`tel:${COMPANY_PHONES.administrativo.tel}`} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-inset ring-white/15 hover:bg-white/15">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  <span className="block text-xs uppercase tracking-wide text-white/60">Telefone administrativo</span>
                  <span className="font-semibold">{COMPANY_PHONES.administrativo.display}</span>
                </span>
              </a>
            </div>

            <Link to="/#geradores" className="mt-6 inline-flex text-sm font-semibold text-accent hover:underline">
              Ver todos os geradores
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
      <MobileTabBar />
      <LgpdPopup />
    </div>
  );
}
