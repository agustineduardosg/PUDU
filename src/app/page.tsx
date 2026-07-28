import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StoryOrigin } from "@/components/StoryOrigin";
import { IndustryGrid } from "@/components/IndustryGrid";
import { PuduMethod } from "@/components/PuduMethod";
import { PuduMetaphor } from "@/components/PuduMetaphor";
import { ContactForm } from "@/components/ContactForm";
import { ConversionOutcomes } from "@/components/ConversionOutcomes";
import { DigitalDiagnostic } from "@/components/DigitalDiagnostic";
import { FloatingConversionBar } from "@/components/FloatingConversionBar";
import { ConversionTracker } from "@/components/ConversionTracker";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Software, automatización e IA para empresas en Chile | PUDU",
  description:
    "Creamos landing pages, CRM, automatizaciones, aplicaciones y software a medida para que empresas chilenas vendan, operen y escalen mejor.",
};

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    areaServed: "Chile",
    email: "agustineduardosg@puduit.tech",
    name: "PUDU IT Solutions",
    sameAs: [
      "https://www.instagram.com/puduitsolutions/",
      "https://lnkd.in/d9dmZYc3",
    ],
    telephone: "+56969040587",
    url: "https://puduit.tech",
  };

  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Header />
      <ConversionTracker />
      <Hero />
      <ConversionOutcomes />
      <DigitalDiagnostic />
      <StoryOrigin />
      <IndustryGrid />
      <PuduMethod />
      <PuduMetaphor />
      <ContactForm />
      <Footer />
      <FloatingConversionBar />
    </main>
  );
}
