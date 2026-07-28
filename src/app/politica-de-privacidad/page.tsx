import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Política de privacidad | PUDU IT Solutions",
  description:
    "Política de privacidad de PUDU IT Solutions para sus servicios digitales, CRM e integraciones con Instagram y Meta.",
};

const sections = [
  {
    title: "1. Responsable del tratamiento",
    content: (
      <>
        <p>
          PUDU IT Solutions, con operación en Concepción, Chile, es responsable
          del tratamiento de los datos personales descritos en esta política.
        </p>
        <p>
          Para consultas o solicitudes relacionadas con privacidad puedes
          escribir a{" "}
          <a
            className="font-bold text-brand-blue hover:underline"
            href="mailto:agustineduardosg@puduit.tech"
          >
            agustineduardosg@puduit.tech
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "2. Datos que podemos tratar",
    content: (
      <ul>
        <li>Nombre, empresa, correo electrónico y teléfono.</li>
        <li>
          Nombre de usuario, identificadores técnicos y mensajes enviados a
          nuestras cuentas profesionales en Instagram.
        </li>
        <li>
          Información entregada mediante formularios, solicitudes de
          cotización y conversaciones comerciales.
        </li>
        <li>
          Datos técnicos básicos necesarios para seguridad, diagnóstico y
          funcionamiento de nuestros servicios.
        </li>
        <li>
          Fuente de la visita, campaña, página de entrada, tipo general de
          dispositivo y acciones de conversión realizadas en el sitio. Esta
          medición propia no almacena la dirección IP ni el navegador completo.
        </li>
      </ul>
    ),
  },
  {
    title: "3. Finalidades",
    content: (
      <ul>
        <li>Responder consultas y solicitudes de servicio.</li>
        <li>
          Registrar y administrar prospectos, conversaciones, tareas y
          oportunidades comerciales en nuestro CRM.
        </li>
        <li>
          Recibir y responder mensajes de Instagram autorizados por el usuario.
        </li>
        <li>
          Mantener la seguridad, prevenir abusos y mejorar nuestros procesos y
          servicios.
        </li>
        <li>
          Medir de forma agregada el rendimiento del sitio y atribuir una
          solicitud a su fuente o campaña de origen.
        </li>
        <li>
          Cumplir obligaciones contractuales o legales aplicables en Chile.
        </li>
      </ul>
    ),
  },
  {
    title: "4. Integración con Instagram y Meta",
    content: (
      <>
        <p>
          PUDU utiliza las interfaces oficiales de Meta para administrar
          mensajes de la cuenta profesional @puduitsolutions. La integración
          puede recibir el contenido del mensaje, el identificador de la
          conversación, el nombre de usuario disponible y eventos técnicos
          asociados, como entrega, lectura, edición o reacciones.
        </p>
        <p>
          No solicitamos la contraseña de Instagram mediante nuestro sitio ni
          almacenamos credenciales de acceso de los usuarios. El uso de
          Instagram también está sujeto a las políticas y condiciones de Meta.
        </p>
      </>
    ),
  },
  {
    title: "5. Conservación y eliminación",
    content: (
      <p>
        Conservamos los datos durante el tiempo necesario para atender la
        relación comercial, mantener trazabilidad y cumplir obligaciones
        aplicables. Cuando dejan de ser necesarios, los eliminamos o
        anonimizamos de forma razonable. Puedes solicitar la eliminación de tus
        datos mediante el correo indicado en esta política.
      </p>
    ),
  },
  {
    title: "6. Proveedores y transferencias",
    content: (
      <p>
        Podemos utilizar proveedores de infraestructura, alojamiento, correo,
        bases de datos y plataformas de mensajería únicamente para operar los
        servicios. Algunos proveedores, incluido Meta, pueden procesar
        información fuera de Chile conforme a sus propias políticas y
        mecanismos de protección.
      </p>
    ),
  },
  {
    title: "7. Seguridad",
    content: (
      <p>
        Aplicamos controles técnicos y organizativos razonables, como
        autenticación administrativa, validación criptográfica de webhooks,
        control de acceso y registro de eventos. Ningún sistema puede garantizar
        seguridad absoluta, pero revisamos y mejoramos estas medidas
        periódicamente.
      </p>
    ),
  },
  {
    title: "8. Tus derechos",
    content: (
      <p>
        Puedes solicitar información, actualización, rectificación, bloqueo o
        eliminación de tus datos, según corresponda bajo la normativa chilena.
        También puedes pedir que no continuemos un contacto comercial. Para
        validar y responder la solicitud podremos pedir antecedentes mínimos
        que permitan confirmar tu identidad.
      </p>
    ),
  },
  {
    title: "9. Menores de edad",
    content: (
      <p>
        Nuestros servicios están dirigidos a empresas y personas adultas. No
        recopilamos intencionalmente datos de menores de edad para fines
        comerciales.
      </p>
    ),
  },
  {
    title: "10. Cambios a esta política",
    content: (
      <p>
        Podemos actualizar esta política cuando cambien nuestros servicios,
        integraciones o requisitos aplicables. La versión vigente se publicará
        siempre en esta URL con su fecha de actualización.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-12">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-brand-blue">
              Privacidad y datos
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Política de privacidad
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/60">
              Esta política explica cómo PUDU IT Solutions utiliza y protege
              datos personales en su sitio, CRM y canales digitales.
            </p>
            <p className="mt-4 text-sm font-bold text-foreground/40">
              Última actualización: 28 de julio de 2026
            </p>
          </div>

          <div className="space-y-5">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-foreground/10 bg-foreground/[0.025] p-6 sm:p-8"
              >
                <h2 className="text-xl font-black">{section.title}</h2>
                <div className="mt-4 space-y-3 leading-7 text-foreground/65 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {section.content}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="rounded-xl bg-foreground px-6 py-3 text-sm font-black text-background transition-transform hover:scale-[1.02]"
            >
              Volver al inicio
            </Link>
            <a
              href="mailto:agustineduardosg@puduit.tech"
              className="rounded-xl border border-foreground/10 px-6 py-3 text-sm font-black hover:bg-foreground/5"
            >
              Contactar a PUDU
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
