"use client";

import React from "react";
import { Linkedin, Github, Instagram, MapPin } from "lucide-react";
import PuduLogo from "./PuduLogo";
import Link from "next/link";

import { AdminLoginModal } from "./admin/AdminLoginModal";

export const Footer = () => {
  const solutions = [
    { name: "Minería (SIO Min)", href: "/industrias/mineria" },
    { name: "Salud (SIO Health)", href: "/industrias/healthcare" },
    { name: "Agricultura (SIO Agro)", href: "/industrias/agricultura" },
    { name: "Industria 4.0 (SIO Ind)", href: "/industrias/industrial" },
    { name: "Automoción (SIO Logistics)", href: "/industrias/automocion" },
    { name: "E-commerce (SIO E-com)", href: "/industrias/ecommerce" },
    { name: "Desarrollo de Apps", href: "/industrias/desarrollo-apps" },
    { name: "Páginas Web Pro", href: "/industrias/paginas-web-pro" },
    { name: "Videovigilancia Rural", href: "/industrias/videovigilancia-rural" },
    { name: "Redes e Infraestructura", href: "/industrias/redes-infraestructura" },
    { name: "Cybersecurity & GovTech", href: "/industrias/cybersecurity-govtech" },
    { name: "Construcción (SesHat Pro)", href: "/industrias/construccion" },
  ];

  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  return (
    <footer className="py-20 bg-[#020617] text-white relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="col-span-1 md:col-span-4">
            <PuduLogo color="white" className="h-10 w-28 mb-8" />
            <p className="text-white/50 leading-relaxed mb-8 max-w-sm">
              La Casa Tecnológica líder en transformación digital industrial en Chile. Ingeniería ágil, resultados de alta precisión y arquitectura senior.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://lnkd.in/d9dmZYc3" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all text-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/puduitsolutions?igsh=MWozNW9ud2VxcTBnag%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://github.com/agustineduardosg/PUDU" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 hover:text-white transition-all text-white">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
 
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest text-brand-blue">Navegación</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><Link href="/#soluciones" className="hover:text-brand-blue transition-colors">Soluciones</Link></li>
              <li><Link href="/#metodo" className="hover:text-brand-blue transition-colors">Método PUDU</Link></li>
              <li><Link href="/#contacto" className="hover:text-brand-blue transition-colors">Contacto</Link></li>
            </ul>
          </div>
 
          <div className="col-span-1 md:col-span-4">
            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest text-brand-blue">Soluciones High-End</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {solutions.map((sol) => (
                <Link 
                  key={sol.name} 
                  href={sol.href} 
                  className="text-white/60 text-sm hover:text-brand-blue transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-brand-blue/40" />
                  {sol.name}
                </Link>
              ))}
            </div>
          </div>
 
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest text-brand-blue">Oficina</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
                <span>Concepción, Chile</span>
              </li>
              <li className="pt-4 border-t border-white/5 font-medium text-white/80">
                PUDU IT Solutions
              </li>
            </ul>
          </div>
        </div>
 
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/40">
          <div className="flex flex-col gap-1">
            <p>© 2026 PUDU (Prime Utility Digital Upgrade). Todos los derechos reservados.</p>
            <p className="text-brand-blue/60 font-medium">CEO Agustin Eduardo Salazar Gonzalez | Concepción, Chile</p>
          </div>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="text-white/20 hover:text-brand-blue transition-colors flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-brand-blue transition-colors" />
              Portal de Sistemas
            </button>
            <p className="text-xs">Potenciado por <span className="text-white/60">Vibe Coding & Precision AI.</span></p>
          </div>
        </div>
      </div>

      <AdminLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </footer>
  );
};
