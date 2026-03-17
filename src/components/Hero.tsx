"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PuduLogo from "./PuduLogo";

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 mb-8 backdrop-blur-md">
            <PuduLogo className="h-4 w-4" color="#10B981" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-emerald">La nueva era industrial</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-7xl font-black mb-8 leading-tight tracking-tight text-white px-2"
          >
            No construimos software. <br />
            <span className="text-gradient-emerald text-2xl md:text-6xl block mt-2">
              Entregamos el Upgrade que tu industria necesita.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            &quot;En un mundo que se mueve a la velocidad del rayo, las soluciones tradicionales de IT se han vuelto lentas, costosas y desconectadas de la realidad del terreno. PUDU nace de una convicción simple: <span className="text-brand-emerald font-medium">La tecnología debe ser tan ágil como nuestra fauna y tan sólida como nuestra industria.</span>&quot;
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="px-10 py-5 bg-gradient-fire text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-fire-start/20 hover:scale-[1.05] transition-all flex items-center gap-2 group">
              Inicia tu Transformación <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm">
              Ver el Método PUDU
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative animated elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 opacity-40 text-white">
        <span className="text-xs font-bold uppercase tracking-tighter">Explorar</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 h-12 bg-gradient-to-b from-brand-emerald to-transparent rounded-full"
        />
      </div>
    </section>
  );
};
