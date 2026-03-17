"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Pickaxe, Stethoscope, Sprout, Car, Settings, ArrowUpRight, CheckCircle2 } from "lucide-react";

export const IndustryGrid = () => {
  const industries = [
    {
      id: "mineria",
      title: "Minería",
      features: [
        "Telemetría de Activos: Monitoreo en tiempo real de flotas y maquinaria pesada.",
        "Mantenimiento Predictivo: Algoritmos de IA para reducir tiempos de inactividad no programados.",
        "Seguridad Proactiva: Sistemas de control de fatiga y alertas de riesgo en faena."
      ],
      icon: <Pickaxe className="w-8 h-8 text-white" />,
      span: "md:col-span-2 md:row-span-2",
      image: "/images/industries/mineria-pudu.jpg",
      priority: true,
    },
    {
      id: "healthcare",
      title: "Atención Sanitaria",
      features: [
        "Interoperabilidad Total: Integración de sistemas bajo normativa SIS/MINSAL (Experiencia RedCuida).",
        "Gestión de Pacientes: Motores inteligentes de agendamiento y flujos clínicos optimizados.",
        "Telemedicina Avanzada: Plataformas seguras de atención remota con historial clínico unificado."
      ],
      icon: <Stethoscope className="w-8 h-8 text-white" />,
      span: "md:col-span-2 md:row-span-1",
      image: "/images/industries/healthcare-pudu.jpg",
    },
    {
      id: "agricultura",
      title: "Agricultura",
      features: [
        "Eficiencia Hídrica: Sensores IoT para el monitoreo de humedad y riesgo de precisión.",
        "Trazabilidad Digital: Registro automatizado de la cadena de valor para certificaciones de exportación.",
        "Monitoreo Satelital: Dashboards de rendimiento de cultivo y salud de suelos."
      ],
      icon: <Sprout className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/agricultura-pudu.jpg",
    },
    {
      id: "industrial",
      title: "Sector Industrial",
      features: [
        "Optimización OEE: Visualización de la Eficiencia General de los Equipos en tiempo real.",
        "Automatización de Procesos: Eliminación de cuellos de botella mediante software a medida.",
        "Inventario Inteligente: Control de stock crítico y reabastecimiento automatizado."
      ],
      icon: <Settings className="w-8 h-8 text-white" />,
      span: "md:col-span-2 md:row-span-1",
      image: "/images/industries/industrial-pudu.jpg",
    },
    {
      id: "automocion",
      title: "Automoción",
      features: [
        "Gestión de Flotas: Seguimiento inteligente y optimización de consumo de combustible.",
        "Servicio Proactivo: Portales de mantenimiento que anticipan las necesidades del cliente.",
        "Logística de Última Milla: Planificación de rutas dinámicas para máxima eficiencia operativa."
      ],
      icon: <Car className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-2",
      image: "/images/industries/automocion-pudu.jpg",
    },
  ];

  return (
    <section id="industrias" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-emerald">Sectores Clave</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Industrias <span className="text-gradient-emerald">Estratégicas</span>
          </h2>
          <p className="text-xl text-foreground/60 leading-relaxed">
            Aplicamos soluciones tecnológicas específicas para los pilares económicos de Chile, forjando resiliencia a través del <span className="text-foreground font-bold">Upgrade Digital.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto md:auto-rows-[250px]">
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
              
              <div className="relative z-20 h-full p-6 md:p-10 flex flex-col items-start justify-between text-white pointer-events-none">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-brand-emerald group-hover:border-brand-emerald transition-all duration-500">
                  {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-6 h-6 md:w-8 md:h-8 text-white" })}
                </div>
                
                <div className="w-full mt-10 md:mt-0">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-xl md:text-2xl font-black tracking-tight">{item.title}</h3>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:space-y-2 mt-2 md:mt-4">
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0 mt-0.5" />
                        <p className="text-white/80 text-[11px] md:text-xs leading-relaxed md:leading-tight group-hover:text-white transition-colors">
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
