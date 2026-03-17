import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { 
  ArrowRight, CheckCircle2, Globe, Rocket, Shield,
  Gauge, Activity, ShieldAlert, Box, 
  Network, ClipboardCheck, Users, Video, 
  Droplets, QrCode, Sprout, Truck, 
  BarChart3, Cpu, PackageSearch, Settings2, MapPin
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import industriesData from "@/data/industriesContent.json";

// Type for the industry data
interface IndustryContent {
  id: string;
  colorTheme: string;
  hero: {
    title: string;
    subtitle: string;
    videoPlaceholderUrl: string;
  };
  storytelling: {
    pain: string;
    solution: string;
    upgrade: string;
  };
  detailedServices: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  transversalValue: string;
  ctaLabel: string;
}

const industries = industriesData as Record<string, IndustryContent>;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const industry = industries[id];
  
  if (!industry) return { title: "Industria no encontrada | PUDU" };

  return {
    title: `${industry.hero.title} | PUDU Specialized`,
    description: industry.hero.subtitle,
    openGraph: {
      title: `${industry.hero.title} | PUDU`,
      description: industry.hero.subtitle,
      images: [`/images/industries/${id}-pudu.jpg`],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(industries).map((id) => ({
    id,
  }));
}

export default async function IndustryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const industry = industries[id];

  if (!industry) {
    notFound();
  }

  const IconMap: Record<string, React.ElementType> = {
    Gauge, Activity, ShieldAlert, Box,
    Network, ClipboardCheck, Users, Video,
    Droplets, QrCode, Sprout, Truck,
    BarChart3, Cpu, PackageSearch, Settings2, MapPin, Globe
  };

  const IconComponent = (iconName: string) => {
    const Icon = IconMap[iconName] || Globe;
    return <Icon className="w-8 h-8" />;
  };

  return (
    <main className="min-h-screen bg-background" style={{ 
      "--industry-accent": industry.colorTheme,
      "--industry-accent-glow": `${industry.colorTheme}33`
    } as React.CSSProperties}>
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-slate-950/60 z-10" />
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src={`/images/industries/${id}-pudu.jpg`}
            alt={industry.hero.title}
            fill
            className="object-cover"
            priority
          />
          {/* Fallback/Overlay pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--industry-accent)_0%,_transparent_70%)] opacity-20" />
        </div>
        
        <div className="container mx-auto px-6 relative z-20 text-center">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 backdrop-blur-md"
            style={{ borderColor: `${industry.colorTheme}44`, backgroundColor: `${industry.colorTheme}11` }}
          >
            <Shield className="w-4 h-4" style={{ color: industry.colorTheme }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: industry.colorTheme }}>
              PUDU Specialized: {id.toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
            {industry.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            {industry.hero.subtitle}
          </p>
          <a 
            href="#contacto"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-black text-lg text-white transition-all transform hover:scale-105"
            style={{ backgroundColor: industry.colorTheme }}
          >
            {industry.ctaLabel} <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Storytelling Section */}
      <section className="py-24 border-b border-border/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-12 leading-tight">
                El Desafío <br />
                <span className="opacity-40 italic">y nuestra</span> <br />
                <span style={{ color: industry.colorTheme }}>Propuesta de Valor.</span>
              </h2>
              <div className="space-y-8 text-lg md:text-xl text-foreground/70 leading-relaxed">
                <p><span className="font-bold text-foreground">El Dolor:</span> {industry.storytelling.pain}</p>
                <p><span className="font-bold text-foreground">La Solución:</span> {industry.storytelling.solution}</p>
              </div>
            </div>
            <div className="glass p-10 rounded-[2.5rem] border-l-4" style={{ borderLeftColor: industry.colorTheme }}>
              <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center" style={{ backgroundColor: `${industry.colorTheme}22` }}>
                <Rocket className="w-8 h-8" style={{ color: industry.colorTheme }} />
              </div>
              <h3 className="text-2xl font-black mb-4">El Upgrade PUDU</h3>
              <p className="text-xl text-foreground/80 leading-relaxed italic">
                &quot;{industry.storytelling.upgrade}&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Servicios de Misión Crítica</h2>
            <p className="text-lg text-foreground/60">
              Soluciones diseñadas específicamente para responder a la complejidad del sector {id}.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industry.detailedServices.map((service, idx) => (
              <div 
                key={idx} 
                className="p-10 glass rounded-[2rem] hover:shadow-xl transition-all group border border-transparent hover:border-[var(--industry-accent-glow)] mx-auto w-full"
              >
                <div 
                  className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ backgroundColor: `${industry.colorTheme}11`, color: industry.colorTheme }}
                >
                  {IconComponent(service.icon)}
                </div>
                <h3 className="text-2xl font-black mb-4">{service.title}</h3>
                <p className="text-foreground/60 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transversal Value (DMA + Vibe Coding) */}
      <section className="py-24 bg-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div 
            className="w-full h-full" 
            style={{ background: `radial-gradient(circle at center, ${industry.colorTheme}, transparent)` }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex font-black text-xs uppercase tracking-widest mb-6 opacity-60">Metodología de Impacto</div>
            <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight">
              Estrategia DMA y Ejecución <span style={{ color: industry.colorTheme }}>Vibe Coding.</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-12">
              {industry.transversalValue}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: industry.colorTheme }} />
                <div>
                  <h4 className="font-bold text-lg mb-2">Auditoría DMA</h4>
                  <p className="text-white/50 text-sm">Evaluación profunda de madurez digital para una hoja de ruta sin fricciones.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: industry.colorTheme }} />
                <div>
                  <h4 className="font-bold text-lg mb-2">Vibe Coding</h4>
                  <p className="text-white/50 text-sm">Despliegue acelerado mediante IA y supervisión senior de clase mundial.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <div id="contacto">
        <ContactForm preselectedIndustry={id} themeColor={industry.colorTheme} />
      </div>

      <Footer />
    </main>
  );
}
