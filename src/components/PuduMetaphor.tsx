"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Globe2 } from "lucide-react";
import PuduLogo from "./PuduLogo";

export const PuduMetaphor = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-foreground/[0.01]">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 md:p-20 rounded-[3rem] border-brand-emerald/10 relative"
          >
            {/* Geometric accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald/5 blur-3xl -z-10" />
            
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-br from-brand-emerald to-brand-blue rounded-full opacity-10 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PuduLogo 
                      className="w-40 h-40" 
                      color="#10B981" 
                      hoverColor="#0EA5E9"
                    />
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-3xl md:text-5xl font-black mb-8">
                  El Pudú: <br />
                  <span className="text-gradient-emerald">Pequeño, Ágil, Imparable.</span>
                </h2>
                <p className="text-xl text-foreground/70 leading-relaxed mb-8">
                  &quot;Elegimos al Pudú porque representa nuestra esencia: es nativo de nuestra tierra, se mueve con una agilidad asombrosa en terrenos difíciles y es capaz de sortear obstáculos donde los gigantes se quedan atrapados.&quot;
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 glass rounded-lg flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-brand-fire-start" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Evolución Nativa</h4>
                      <p className="text-sm text-foreground/50">Nuestra adaptabilidad es parte de nuestro ADN chileno.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 glass rounded-lg flex items-center justify-center shrink-0">
                      <Globe2 className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Velocidad Global</h4>
                      <p className="text-sm text-foreground/50">Ejecutamos con estándares internacionales de alta tecnología.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
