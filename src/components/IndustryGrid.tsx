"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Pickaxe, Stethoscope, Sprout, Car, Settings, ArrowUpRight } from "lucide-react";

export const IndustryGrid = () => {
  const industries = [
    {
      title: "Minería",
      description: "Telemetría inteligente y seguridad de vanguardia.",
      icon: <Pickaxe className="w-8 h-8 text-white" />,
      span: "md:col-span-2 md:row-span-2",
      image: "/images/industries/mining-pudu.jpg.png",
      priority: true,
    },
    {
      title: "Atención Sanitaria",
      description: "Interoperabilidad basada en la experiencia RedCuida.",
      icon: <Stethoscope className="w-8 h-8 text-white" />,
      span: "md:col-span-2 md:row-span-1",
      image: "/images/industries/healthcare-pudu.jpg.jpg",
    },
    {
      title: "Agricultura",
      description: "IoT y optimización de datos de campo en tiempo real.",
      icon: <Sprout className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-1",
      image: "/images/industries/agriculture-pudu.jpg.jpg",
    },
    {
      title: "Automoción",
      description: "Sistemas de gestión integrados para la logística global.",
      icon: <Car className="w-8 h-8 text-white" />,
      span: "md:col-span-1 md:row-span-2",
      image: "/images/industries/automotive-pudu.jpg.jpg",
    },
    {
      title: "Sector Industrial",
      description: "Automatización de procesos y eficiencia operativa total.",
      icon: <Settings className="w-8 h-8 text-white" />,
      span: "md:col-span-2 md:row-span-1",
      image: "/images/industries/industrial-pudu.jpg.jpg",
    },
  ];

  return (
    <section id="industrias" className="py-24 bg-white overflow-hidden">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
          {industries.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative overflow-hidden group rounded-[2rem] shadow-xl border border-border/5 ${item.span}`}
            >
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
              
              <div className="relative z-20 h-full p-8 md:p-10 flex flex-col items-start justify-between text-white">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-brand-emerald group-hover:border-brand-emerald transition-all duration-500">
                  {item.icon}
                </div>
                
                <div className="w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed group-hover:text-white transition-colors line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
