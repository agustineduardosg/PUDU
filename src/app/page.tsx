import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StoryOrigin } from "@/components/StoryOrigin";
import { IndustryGrid } from "@/components/IndustryGrid";
import { PuduMethod } from "@/components/PuduMethod";
import { PuduMetaphor } from "@/components/PuduMetaphor";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "PUDU | Prime Utility Digital Upgrade Specialized",
  description: "Transformación digital de precisión para minería, salud, agricultura e industria en Chile.",
};

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <StoryOrigin />
      <IndustryGrid />
      <PuduMethod />
      <PuduMetaphor />
      <ContactForm />
      <Footer />
    </main>
  );
}
