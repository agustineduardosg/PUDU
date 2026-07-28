"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Pickaxe, 
  Stethoscope, 
  Sprout, 
  Car, 
  Settings, 
  ArrowUpRight, 
  CheckCircle2, 
  ShoppingCart, 
  Smartphone, 
  Globe, 
  Cctv, 
  Network,
  ShieldCheck,
  HardHat 
} from "lucide-react";

export const IndustryGrid = () => {
  const industries = [
    {
      id: "mineria",
      title: "Minería (SIO Min)",
      features: [
        "Sincronización Operativa 24/7",
        "Predicción de Fallas",
        "Telemetría Avanzada"
      ],
      icon: <Pickaxe className="w-8 h-8 text-white" />,
      span: "md:col-span-2 md:row-span-2",
      image: "/images/industries/mineria-pudu.jpg",
      priority: true,
    },
    {
      id: "healthcare",
      title: "Salud (SIO Health)",
      features: [
        "Ecosistemas Clínicos Seguros",
        "Interoperabilidad SIS/MINSAL",
        "Estándares Internacionales"
      ],
      icon: <Stethoscope className="w-8 h-8 text-white" />,
      span: "md:col-span-2 md:row-span-1",
      image: "/images/industries/healthcare-pudu.jpg",
    },
    {
      id: "agricultura",
      title: "Agricultura (SIO Agro)",
      features: [
        "Gestión Hídrica Inteligente",
        "IoT de Campo",
        "Máxima Trazabilidad"
      ],
      icon: <Sprout className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/agricultura-pudu.jpg",
    },
    {
      id: "industrial",
      title: "Industria 4.0 (SIO Ind)",
      features: [
        "Automatización Industrial",
        "Visibilidad Total de Planta",
        "Manufactura del Futuro"
      ],
      icon: <Settings className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/industrial-pudu.jpg",
    },
    {
      id: "automocion",
      title: "Automoción (SIO Logistics)",
      features: [
        "Sincronización de Última Milla",
        "Gestión Avanzada de Flotas",
        "Precisión Logística"
      ],
      icon: <Car className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-2",
      image: "/images/industries/automocion-pudu.jpg",
    },
    {
      id: "ecommerce",
      title: "E-commerce (SIO E-com)",
      features: [
        "Venta Omnicanal",
        "Sincronización de Stock",
        "Logística en Tiempo Real"
      ],
      icon: <ShoppingCart className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/ecommerce-pudu.jpg",
    },
    {
      id: "desarrollo-apps",
      title: "Desarrollo de Apps",
      features: [
        "Apps iOS/Android Escalables",
        "Arquitectura Senior",
        "React Native/Flutter"
      ],
      icon: <Smartphone className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/apps-pudu.jpg",
    },
    {
      id: "paginas-web-pro",
      title: "Páginas Web Pro",
      features: [
        "Alto Rendimiento",
        "Optimizado para SEO",
        "Next.js/React"
      ],
      icon: <Globe className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/web-pudu.jpg",
    },
    {
      id: "videovigilancia-rural",
      title: "Videovigilancia Rural",
      features: [
        "Sistemas Off-Grid (Solares)",
        "Inteligencia Artificial",
        "Perímetros Críticos"
      ],
      icon: <Cctv className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/surveillance-pudu.jpg",
    },
    {
      id: "redes-infraestructura",
      title: "Redes e Infraestructura",
      features: [
        "Redes Corporativas",
        "Backbone Industrial",
        "Diseño e Implementación"
      ],
      icon: <Network className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/network-pudu.jpg",
    },
    {
      id: "cybersecurity-govtech",
      title: "Cybersec & GovTech",
      features: [
        "Safetica DLP (Software)",
        "Compliance Ley 21.719",
        "Alianza e-know (20 años)"
      ],
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/cybersecurity-pudu.jpg",
    },
    {
      id: "construccion",
      title: "Construcción y Adm. (SesHat Pro)",
      features: [
        "SesHat Pro Building",
        "Asistente IA ISIS",
        "Gestión Contractual"
      ],
      icon: <HardHat className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/construccion-pudu.jpg",
    },
  ];

  return (
    <section id="soluciones" className="py-24 bg-background overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">Ecosistemas de Precisión</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Soluciones <span className="text-gradient-emerald">High-End</span>
          </h2>
          <p className="text-xl text-foreground/60 leading-relaxed">
            Homogenizamos nuestra oferta técnica bajo estándares de <span className="text-foreground font-bold">Arquitectura Senior</span> para los sectores más críticos de la economía.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 auto-rows-auto md:auto-rows-[250px]">
          {industries.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative overflow-hidden group rounded-[2rem] shadow-xl border border-border/5 min-h-[300px] md:min-h-0 ${item.span}`}
            >
              <Link href={`/industrias/${item.id}`} className="absolute inset-0 z-30 cursor-pointer" />
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={item.priority}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
              </div>
              
              <div className="relative z-20 h-full p-6 md:p-8 flex flex-col items-start justify-between text-white pointer-events-none">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-brand-blue group-hover:border-brand-blue transition-all duration-500">
                  {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6 md:w-8 md:h-8 text-white" })}
                </div>
                
                <div className="w-full mt-10 md:mt-0">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-lg md:text-xl font-black tracking-tight">{item.title}</h3>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:space-y-2 mt-2 md:mt-4">
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue shrink-0 mt-0.5" />
                        <p className="text-white/80 text-[10px] md:text-[11px] leading-relaxed md:leading-tight group-hover:text-white transition-colors">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

