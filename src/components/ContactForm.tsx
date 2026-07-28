"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import PuduLogo from "./PuduLogo";
import { submitContactForm } from "@/app/actions";
import {
  getConversionContext,
  trackConversion,
} from "@/lib/analytics/client";

type ContactFormProps = {
  preselectedIndustry?: string;
  themeColor?: string;
};

type Attribution = {
  conversionSessionKey: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  landingPath: string;
  referrer: string;
};

const interestOptions = [
  ["Transformación digital general", "Aún no sé qué solución necesito"],
  ["Landing page y conversión", "Landing page o sitio que convierta"],
  ["CRM y gestión comercial", "CRM y seguimiento de ventas"],
  ["Automatización e IA", "Automatización de tareas e inteligencia artificial"],
  ["Software, SaaS o aplicación", "Software, SaaS o aplicación a medida"],
  ["Agenda online", "Agenda online y gestión de clientes"],
  ["Integración de sistemas y datos", "Integración de sistemas y datos"],
  ["Ciberseguridad y monitoreo", "Ciberseguridad y monitoreo"],
];

export const ContactForm = ({
  preselectedIndustry,
  themeColor,
}: ContactFormProps) => {
  return (
    <section id="contacto" className="scroll-mt-24 bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="glass mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border-border/10 shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col justify-between bg-black p-8 text-white sm:p-12 lg:w-2/5">
              <div>
                <PuduLogo color="white" className="mb-8 h-10 w-28" />
                <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-brand-emerald">
                  Diagnóstico inicial sin costo
                </p>
                <h2 className="mb-6 text-3xl font-black sm:text-4xl">
                  Cuéntanos dónde se frena tu negocio.
                </h2>
                <p className="mb-10 text-white/65">
                  Revisaremos tu caso y te propondremos una ruta concreta: qué
                  resolver primero, cómo medirlo y qué tecnología necesitas.
                </p>

                <div className="space-y-7">
                  <ContactItem
                    icon={<Clock3 className="h-6 w-6 text-brand-emerald" />}
                    label="Compromiso"
                    value="Respuesta humana en 1 día hábil"
                  />
                  <ContactItem
                    icon={<Phone className="h-6 w-6 text-brand-emerald" />}
                    label="Teléfono"
                    value="+56 9 6904 0587"
                  />
                  <ContactItem
                    icon={<Mail className="h-6 w-6 text-brand-blue" />}
                    label="Email"
                    value="agustineduardosg@puduit.tech"
                  />
                  <ContactItem
                    icon={<MapPin className="h-6 w-6 text-brand-fire-start" />}
                    label="Cobertura"
                    value="Concepción y todo Chile"
                  />
                </div>
              </div>

              <div className="mt-16 border-t border-white/10 pt-8">
                <p className="text-sm italic text-white/45">
                  Sin spam ni propuestas genéricas. Primero entendemos el
                  problema.
                </p>
              </div>
            </div>

            <div className="bg-background/50 p-8 backdrop-blur-xl sm:p-12 lg:w-3/5">
              <ContactFormInner
                preselectedIndustry={preselectedIndustry}
                themeColor={themeColor}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-5">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-xs font-bold uppercase tracking-widest text-white/40">
        {label}
      </div>
      <div className="break-words text-base sm:text-lg">{value}</div>
    </div>
  </div>
);

const ContactFormInner = ({
  preselectedIndustry,
  themeColor,
}: ContactFormProps) => {
  const [state, setState] = useState<{ success?: string; error?: string }>({});
  const [isPending, setIsPending] = useState(false);
  const [interest, setInterest] = useState(
    preselectedIndustry || "Transformación digital general",
  );
  const [message, setMessage] = useState("");
  const formStartedRef = useRef(false);
  const [attribution, setAttribution] = useState<Attribution>({
    conversionSessionKey: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    landingPath: "",
    referrer: "",
  });

  useEffect(() => {
    const handleDiagnostic = (event: Event) => {
      const customEvent = event as CustomEvent<{
        interest?: string;
        message?: string;
      }>;

      if (customEvent.detail?.interest) {
        setInterest(customEvent.detail.interest);
      }
      if (customEvent.detail?.message) {
        setMessage(customEvent.detail.message);
      }
    };

    const locationTimer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const queryInterest = params.get("interest");

      if (queryInterest) {
        setInterest(queryInterest);
      }

      const context = getConversionContext();
      setAttribution({
        conversionSessionKey: context.sessionKey,
        landingPath: context.landingPath,
        referrer: context.referrer,
        utmCampaign: context.utmCampaign,
        utmContent: context.utmContent,
        utmMedium: context.utmMedium,
        utmSource: context.utmSource,
      });
    }, 0);

    window.addEventListener("pudu:diagnostic", handleDiagnostic);
    return () => {
      window.clearTimeout(locationTimer);
      window.removeEventListener("pudu:diagnostic", handleDiagnostic);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setState({});

    const form = event.currentTarget;
    const result = await submitContactForm(new FormData(form));

    if (result.error) {
      setState({ error: result.error });
    } else {
      setState({ success: result.success });
      form.reset();
      setInterest("Transformación digital general");
      setMessage("");
    }
    setIsPending(false);
  };

  const handleFormFocus = () => {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackConversion("CONTACT_FORM_STARTED");
  };

  return (
    <form
      className="space-y-6"
      onFocusCapture={handleFormFocus}
      onSubmit={handleSubmit}
    >
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-blue">
          Empecemos por tu objetivo
        </p>
        <h3 className="mt-2 text-3xl font-black text-foreground">
          Solicita tu diagnóstico digital
        </h3>
      </div>

      {state.success && (
        <div className="flex items-center gap-3 rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 p-4 text-brand-emerald">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-bold">{state.success}</p>
        </div>
      )}
      {state.error && (
        <div className="flex items-center gap-3 rounded-2xl border border-brand-fire-start/20 bg-brand-fire-start/10 p-4 text-brand-fire-start">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-bold">{state.error}</p>
        </div>
      )}

      <input
        type="hidden"
        name="conversionSessionKey"
        value={attribution.conversionSessionKey}
      />
      <input type="hidden" name="utmSource" value={attribution.utmSource} />
      <input type="hidden" name="utmMedium" value={attribution.utmMedium} />
      <input type="hidden" name="utmCampaign" value={attribution.utmCampaign} />
      <input type="hidden" name="utmContent" value={attribution.utmContent} />
      <input type="hidden" name="landingPath" value={attribution.landingPath} />
      <input type="hidden" name="referrer" value={attribution.referrer} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Nombre">
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Ej: Camila Soto"
            className="form-control"
          />
        </Field>
        <Field label="Empresa (opcional)">
          <input
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Ej: Clínica Sur"
            className="form-control"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Correo">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="camila@empresa.cl"
            className="form-control"
          />
        </Field>
        <Field label="WhatsApp (opcional)">
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+56 9 1234 5678"
            className="form-control"
          />
        </Field>
      </div>

      <Field label="¿Qué quieres mejorar primero?">
        <select
          name="interest"
          value={interest}
          onChange={(event) => setInterest(event.target.value)}
          className="form-control cursor-pointer appearance-none"
          style={
            themeColor
              ? ({ borderColor: `${themeColor}33` } as React.CSSProperties)
              : {}
          }
        >
          {interestOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
          {preselectedIndustry &&
            !interestOptions.some(([value]) => value === preselectedIndustry) && (
              <option value={preselectedIndustry}>{preselectedIndustry}</option>
            )}
        </select>
      </Field>

      <Field label="¿Qué está ocurriendo hoy?">
        <textarea
          name="message"
          rows={4}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ej: Los contactos llegan por Instagram, pero no tenemos seguimiento y se pierden oportunidades."
          className="form-control resize-none"
        />
      </Field>

      <button
        disabled={isPending}
        className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-lg font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        style={{
          background: themeColor
            ? `linear-gradient(to right, ${themeColor}, ${themeColor}dd)`
            : "linear-gradient(to right, #059669, #2563eb)",
          boxShadow: themeColor
            ? `0 20px 25px -5px ${themeColor}33`
            : undefined,
        }}
      >
        {isPending ? (
          <>
            Enviando... <Loader2 className="h-5 w-5 animate-spin" />
          </>
        ) : (
          <>
            Solicitar diagnóstico inicial <Send className="h-5 w-5" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-foreground/50">
        Respuesta humana en 1 día hábil. Tus datos no se comparten.
      </p>
    </form>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label className="ml-1 text-sm font-bold">{label}</label>
    {children}
  </div>
);
