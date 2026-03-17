"use client";

import React from "react";
import { Linkedin, Github, Twitter } from "lucide-react";
import PuduLogo from "./PuduLogo";

export const Footer = () => {
  return (
    <footer className="py-20 bg-[#0F172A] text-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <PuduLogo color="white" className="h-10 w-28 mb-8" />
            <p className="text-white/50 leading-relaxed mb-8">
              La Casa Tecnológica líder en transformación digital industrial en Chile. Ingeniería ágil, resultados superiores.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-emerald hover:text-white transition-all text-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 hover:text-white transition-all text-white">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
 
          <div>
            <h4 className="font-bold mb-6 text-white">Navegación</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="/#industrias" className="hover:text-brand-emerald transition-colors">Industrias</a></li>
              <li><a href="/#servicios" className="hover:text-brand-emerald transition-colors">Servicios</a></li>
              <li><a href="/#metodo" className="hover:text-brand-emerald transition-colors">Método PUDU</a></li>
              <li><a href="#" className="hover:text-brand-emerald transition-colors">Casos de Éxito</a></li>
            </ul>
          </div>
 
          <div>
            <h4 className="font-bold mb-6 text-white">Soluciones</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-brand-blue transition-colors">Inteligencia Artificial</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">IoT Industrial</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Ciberseguridad</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Nube Híbrida</a></li>
            </ul>
          </div>
 
          <div>
            <h4 className="font-bold mb-6 text-white">Legal</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-brand-fire-start transition-colors">Aviso Legal</a></li>
              <li><a href="#" className="hover:text-brand-fire-start transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-brand-fire-start transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
 
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© 2026 PUDU (Prime Utility Digital Upgrade). Todos los derechos reservados.</p>
          <p>Potenciado por Vibe Coding & Precision AI.</p>
        </div>
      </div>
    </footer>
  );
};
