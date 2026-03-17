"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Users, TrendingUp } from "lucide-react";

export const PuduMethod = () => {
  const steps = [
    {
      title: "Vibe Coding Efficiency",
      description: "Utilizamos IA generativa de última generación para prototipar e implementar soluciones 3 veces más rápido.",
      icon: <Zap className="w-6 h-6 text-brand-fire-start" />,
    },
    {
      title: "Supervisión Senior",
      description: "Cada línea de código es validada por Gerentes de Proyecto con décadas de experiencia en misiones críticas.",
      icon: <ShieldCheck className="w-6 h-6 text-brand-emerald" />,
    },
    {
      title: "Co-Creación Ágil",
      description: "Nos integramos con tu equipo TI interno para asegurar que la transferencia de conocimiento sea total.",
      icon: <Users className="w-6 h-6 text-brand-blue" />,
    },
    {
      title: "Escalado de Precisión",
      description: "No solo creamos software; construimos plataformas industriales que crecen con tu demanda real.",
      icon: <TrendingUp className="w-6 h-6 text-indigo-500" />,
    },
  ];

  return (
    <section id="metodo" className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              La Revolución del <br />
              <span className="text-brand-emerald">Vibe Coding.</span>
            </h2>
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                ¿Cómo logramos lo que a otros les toma meses en solo semanas? No es magia, es <span className="text-brand-emerald font-bold">Vibe Coding</span>.
              </p>
              <p className="text-base md:text-lg text-foreground/60 leading-relaxed">
                Combinamos décadas de experiencia en Project Management Senior con las herramientas de IA más potentes del planeta. Esto nos permite prototipar, iterar y desplegar soluciones de alta complejidad a una velocidad sin precedentes.
              </p>
              <div className="flex items-center gap-4 p-5 md:p-6 glass rounded-2xl border-brand-fire-start/20">
                <div className="text-3xl md:text-4xl font-black text-brand-fire-start">3x</div>
                <div className="text-xs md:text-sm font-medium leading-tight">
                  Semanas, no meses. <br />
                  Sin sacrificar la robustez arquitectónica que tu empresa exige.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 glass rounded-3xl hover:bg-brand-emerald/5 transition-colors border-foreground/5 group"
              >
                <div className="w-12 h-12 bg-foreground/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-background group-hover:shadow-md transition-all">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
