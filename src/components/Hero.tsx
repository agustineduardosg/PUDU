"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import PuduLogo from "./PuduLogo";
import Link from "next/link";
import { trackConversion } from "@/lib/analytics/client";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-slate-950">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/hero_bg.mp4" type="video/mp4" />
      </video>

      {/* Visual Treatment (Overlay) - Darker and more premium for industrial feel */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] z-10" />

      {/* Premium Watermark Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ 
          opacity: 0.05, 
          scale: 1, 
          rotate: 0,
          y: [0, -20, 0] 
        }}
        transition={{ 
          opacity: { duration: 1.5 },
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      >
        <PuduLogo className="w-[80%] h-[80%] grayscale opacity-100 text-white" color="currentColor" />
      </motion.div>

      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 mb-8 backdrop-blur-md">
            <PuduLogo className="h-4 w-4" color="#10B981" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-emerald">
              Software, automatización e IA desde Chile
            </span>
          </div>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 px-2 text-3xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-7xl"
          >
            Convierte procesos lentos <br />
            <span className="text-gradient-emerald mt-2 block text-2xl md:text-4xl lg:text-6xl">
              en sistemas que venden, coordinan y escalan.
            </span>
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            Diseñamos landing pages, CRM, automatizaciones y software a medida
            para resolver cuellos de botella reales en empresas y
            emprendimientos.
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/#diagnostico"
              onClick={() =>
                trackConversion("CTA_CLICK", {
                  cta: "hero_diagnostic",
                  destination: "diagnostico",
                })
              }
              className="group flex items-center gap-2 rounded-2xl bg-gradient-fire px-8 py-5 text-base font-black text-white shadow-xl shadow-brand-fire-start/20 transition-all hover:scale-[1.03] md:text-lg"
            >
              Obtener diagnóstico gratuito
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#resultados"
              onClick={() =>
                trackConversion("CTA_CLICK", {
                  cta: "hero_outcomes",
                  destination: "resultados",
                })
              }
              className="rounded-2xl border border-white/20 bg-white/10 px-8 py-5 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 md:text-lg"
            >
              Ver cómo podemos ayudarte
            </Link>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-7 hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/55 sm:flex"
          >
            {[
              "Sin compromiso",
              "Respuesta en 1 día hábil",
              "Atención directa",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-emerald" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};
