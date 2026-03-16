"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Crosshair, BarChart3 } from "lucide-react";

export const StoryOrigin = () => {
  return (
    <section className="py-24 relative bg-black text-white overflow-hidden">
      {/* Abstract medical/hex grid background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, #0EA5E9 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-blue/20 blur-3xl rounded-full" />
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Forjados en la <br />
                <span className="text-brand-blue">Complejidad.</span>
              </h2>
              <p className="text-xl text-white/60 leading-relaxed mb-8">
                Nuestro fundador no viene de una oficina de diseño, sino de las trincheras de la Informática Médica. 
                Tras liderar proyectos críticos donde la precisión es una cuestión de vida o muerte (como la arquitectura detrás de <span className="text-white border-b border-brand-blue">RedCuida</span>), entendimos que cada segundo de ineficiencia es una oportunidad perdida.
              </p>
              <p className="text-xl text-white/60 leading-relaxed">
                Decidimos tomar ese rigor del mundo de la salud y llevarlo a la minería, el agro y la industria. Así nació <span className="font-bold text-white tracking-widest uppercase text-sm">PUDU</span>: una respuesta chilena para desafíos que no pueden esperar.
              </p>
            </motion.div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-start hover:bg-white/10 transition-all group">
              <ShieldAlert className="w-10 h-10 text-brand-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Misión Crítica</h3>
              <p className="text-white/40 text-sm">Transferimos la precisión clínica a los procesos industriales más exigentes de Chile.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-start hover:bg-white/10 transition-all group">
              <Crosshair className="w-10 h-10 text-brand-emerald mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Precisión Vital</h3>
              <p className="text-white/40 text-sm">Donde otros ven software, nosotros vemos infraestructura de vida o muerte.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 col-span-1 md:col-span-2 flex items-center gap-8 group">
              <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl flex items-center justify-center shrink-0">
                <BarChart3 className="w-8 h-8 text-brand-blue" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Impacto Real</h3>
                <p className="text-white/40 text-sm">Eficiencia medida en segundos ahorrados y seguridad industrial garantizada.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
