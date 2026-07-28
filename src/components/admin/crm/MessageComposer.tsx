"use client";

import { useMemo, useState } from "react";
import { MessageSquareText, Save, Sparkles } from "lucide-react";
import { createMessageDraft } from "@/app/admin/crm/actions";

const templates = [
  {
    id: "first-contact",
    label: "Primer acercamiento",
    subject: "Una idea tecnológica para tu empresa",
    content:
      "Hola {nombre}, soy parte de PUDU IT Solutions. Estuvimos revisando el trabajo de {empresa} y vemos una oportunidad concreta para mejorar {interes}. ¿Te parece si coordinamos una conversación breve esta semana?",
  },
  {
    id: "follow-up",
    label: "Seguimiento",
    subject: "Seguimiento a nuestra conversación",
    content:
      "Hola {nombre}, quería retomar nuestra conversación sobre {interes}. Podemos preparar una propuesta acotada con alcance, plazos y próximos pasos. ¿Qué día te acomoda revisarla?",
  },
  {
    id: "proposal",
    label: "Envío de propuesta",
    subject: "Propuesta PUDU IT Solutions",
    content:
      "Hola {nombre}, ya preparamos la propuesta para {empresa}. Resume la solución para {interes}, el plan de implementación y la inversión estimada. Quedo atento para revisarla contigo.",
  },
] as const;

type MessageComposerProps = {
  company: string | null;
  email: string;
  interest: string;
  isDemo: boolean;
  leadId: string;
  leadName: string;
};

export function MessageComposer({
  company,
  email,
  interest,
  isDemo,
  leadId,
  leadName,
}: MessageComposerProps) {
  const [channel, setChannel] = useState("EMAIL");
  const [recipient, setRecipient] = useState(email);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const replacements = useMemo(
    () => ({
      "{empresa}": company || leadName,
      "{interes}": interest.toLowerCase(),
      "{nombre}": leadName.split(" ")[0],
    }),
    [company, interest, leadName],
  );

  function applyTemplate(templateId: string) {
    const template = templates.find((candidate) => candidate.id === templateId);

    if (!template) {
      return;
    }

    const personalize = (value: string) =>
      Object.entries(replacements).reduce(
        (result, [token, replacement]) =>
          result.replaceAll(token, replacement),
        value,
      );

    setSubject(personalize(template.subject));
    setContent(personalize(template.content));
  }

  return (
    <form
      action={createMessageDraft}
      className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6"
    >
      <input type="hidden" name="leadId" value={leadId} />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
          <MessageSquareText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-black">Nuevo borrador</h2>
          <p className="text-xs text-white/40">
            Personaliza antes de programar o enviar.
          </p>
        </div>
      </div>

      <label className="block mb-4">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
          Plantilla
        </span>
        <div className="relative mt-2">
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-emerald" />
          <select
            defaultValue=""
            onChange={(event) => applyTemplate(event.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950 py-3 pl-10 pr-3 text-sm"
          >
            <option value="" disabled>
              Selecciona una plantilla
            </option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.label}
              </option>
            ))}
          </select>
        </div>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <label>
          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
            Canal
          </span>
          <select
            name="channel"
            value={channel}
            onChange={(event) => {
              const nextChannel = event.target.value;
              setChannel(nextChannel);
              if (nextChannel === "EMAIL") {
                setRecipient(email);
              }
            }}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
          >
            <option value="EMAIL">Email</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="SMS">SMS</option>
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
            Destinatario
          </span>
          <input
            name="recipient"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
          />
        </label>
      </div>

      <label className="block mb-4">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
          Asunto
        </span>
        <input
          name="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          disabled={channel !== "EMAIL"}
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm disabled:opacity-40"
        />
      </label>

      <label className="block">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
          Mensaje
        </span>
        <textarea
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
          rows={6}
          className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-slate-950 p-3 text-sm leading-relaxed"
          placeholder="Escribe o selecciona una plantilla..."
        />
      </label>

      <button
        type="submit"
        disabled={isDemo}
        className="mt-4 w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-black flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Save className="w-4 h-4" />
        {isDemo ? "Disponible con base real" : "Guardar borrador"}
      </button>
    </form>
  );
}
