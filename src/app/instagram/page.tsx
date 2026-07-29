import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Instagram,
  MessageCircleMore,
  Route,
  Workflow,
} from "lucide-react";
import PuduLogo from "@/components/PuduLogo";
import { InstagramAcquisitionHero } from "@/components/InstagramAcquisitionHero";
import { ConversionOutcomes } from "@/components/ConversionOutcomes";
import { DigitalDiagnostic } from "@/components/DigitalDiagnostic";
import { ContactForm } from "@/components/ContactForm";
import { ConversionTracker } from "@/components/ConversionTracker";
import { Footer } from "@/components/Footer";
import { TrackedConversionLink } from "@/components/TrackedConversionLink";

export const metadata: Metadata = {
  title: "Diagnóstico digital para empresas | PUDU IT Solutions",
  description:
    "Descubre cómo conectar Instagram, WhatsApp, CRM, agenda y automatización para captar y seguir oportunidades sin perder clientes.",
  alternates: { canonical: "/instagram" },
};

const deliverables = [
  "Mapa del problema y de los puntos donde hoy se pierden oportunidades.",
  "Recomendación priorizada: qué resolver primero y por qué.",
  "Ruta inicial para CRM, automatización, landing o software.",
  "Próximo paso concreto, sin compromiso y revisado por una persona.",
];

export default function InstagramLandingPage() {
  return (
    <main className="relative bg-background">
      <ConversionTracker />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-slate-950/80 px-6 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between">
          <PuduLogo href="/" color="white" className="h-8 w-24" />
          <TrackedConversionLink
            href="#contacto"
            cta="instagram_landing_nav_contact"
            destination="contacto"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-emerald px-4 py-2 text-xs font-black text-slate-950 sm:px-5 sm:text-sm"
          >
            Hablar con PUDU
            <ArrowRight className="h-4 w-4" />
          </TrackedConversionLink>
        </div>
      </nav>

      <InstagramAcquisitionHero />
      <ContactForm preselectedIndustry="Transformación digital general" />

      <section className="border-y border-foreground/10 bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-fire-start">
              ¿Te suena familiar?
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              El problema no es recibir consultas.
              <span className="block text-foreground/40">
                Es convertirlas en un proceso.
              </span>
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-3">
            {[
              {
                description:
                  "Instagram, WhatsApp, correos y planillas sin una vista única del cliente.",
                icon: MessageCircleMore,
                title: "Conversaciones separadas",
              },
              {
                description:
                  "Nadie sabe qué lead requiere respuesta, seguimiento o una propuesta.",
                icon: Route,
                title: "Oportunidades sin rumbo",
              },
              {
                description:
                  "El equipo repite tareas que podrían avanzar de forma automática y controlada.",
                icon: Workflow,
                title: "Trabajo manual innecesario",
              },
            ].map((problem) => (
              <article
                key={problem.title}
                className="rounded-[1.75rem] border border-foreground/10 bg-foreground/[0.025] p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-fire-start/10 text-brand-fire-start">
                  <problem.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-black">{problem.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/50">
                  {problem.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ConversionOutcomes basePath="/instagram" />
      <DigitalDiagnostic />

      <section className="bg-slate-950 py-20 text-white">
        <div className="container mx-auto grid gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/15 bg-pink-400/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-pink-300">
              <Instagram className="h-4 w-4" />
              Diagnóstico PUDU
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              No recibirás una propuesta genérica.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/50">
              Primero entendemos cómo funciona tu empresa y dónde existe mayor
              impacto. La tecnología se define después del problema.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {deliverables.map((item, index) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-emerald" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                    Entregable {index + 1}
                  </p>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-white/75">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
