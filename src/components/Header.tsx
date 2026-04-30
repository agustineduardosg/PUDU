"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Pickaxe, Stethoscope, Sprout, Car, Settings, ShoppingCart, Smartphone, Globe, Cctv, Network, ShieldCheck } from "lucide-react";
import PuduLogo from "./PuduLogo";
import Link from "next/link";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const groupA = [
    { name: "Minería (SIO Min)", href: "/industrias/mineria", icon: <Pickaxe className="w-4 h-4" /> },
    { name: "Salud (SIO Health)", href: "/industrias/healthcare", icon: <Stethoscope className="w-4 h-4" /> },
    { name: "Agro de Precisión (SIO Agro)", href: "/industrias/agricultura", icon: <Sprout className="w-4 h-4" /> },
    { name: "Industria 4.0 (SIO Ind)", href: "/industrias/industrial", icon: <Settings className="w-4 h-4" /> },
    { name: "Automoción (SIO Logistics)", href: "/industrias/automocion", icon: <Car className="w-4 h-4" /> },
    { name: "E-commerce (SIO E-com)", href: "/industrias/ecommerce", icon: <ShoppingCart className="w-4 h-4" /> },
    { name: "Cybersecurity & GovTech", href: "/industrias/cybersecurity-govtech", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const groupB = [
    { name: "Desarrollo de Apps", href: "/industrias/desarrollo-apps", icon: <Smartphone className="w-4 h-4" /> },
    { name: "Páginas Web Pro", href: "/industrias/paginas-web-pro", icon: <Globe className="w-4 h-4" /> },
    { name: "Videovigilancia Rural", href: "/industrias/videovigilancia-rural", icon: <Cctv className="w-4 h-4" /> },
    { name: "Redes e Infraestructura", href: "/industrias/redes-infraestructura", icon: <Network className="w-4 h-4" /> },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6">
        <nav className={`glass px-6 py-3 rounded-full flex items-center justify-between transition-all duration-500 ${
          isScrolled ? "bg-opacity-90 dark:bg-slate-900/90" : "bg-opacity-50 dark:bg-slate-900/50"
        }`}>
          {/* Logo */}
          <PuduLogo 
            color="currentColor" 
            className={`h-10 w-28 transition-colors duration-500 ${
              isScrolled ? "text-foreground" : "text-white"
            }`}
          />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div 
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button 
                className={`flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer ${
                  isScrolled 
                    ? "text-foreground/80 hover:text-brand-blue" 
                    : "text-white/90 hover:text-brand-blue"
                }`}
              >
                SOLUCIONES
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${solutionsOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 glass p-8 rounded-[2.5rem] shadow-2xl min-w-[650px] grid grid-cols-2 gap-10 border border-white/10"
                  >
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue mb-6 border-b border-brand-blue/20 pb-2">
                        Ecosistemas SIO (Estratégicos)
                      </h4>
                      <div className="grid gap-4">
                        {groupA.map((item) => (
                          <Link 
                            key={item.name} 
                            href={item.href} 
                            className="flex items-center gap-3 text-sm font-medium text-foreground/70 hover:text-brand-blue transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue/10 transition-colors">
                              {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4 group-hover:scale-110 transition-transform" })}
                            </div>
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue mb-6 border-b border-brand-blue/20 pb-2">
                        Soluciones Técnicas a Medida
                      </h4>
                      <div className="grid gap-4">
                        {groupB.map((item) => (
                          <Link 
                            key={item.name} 
                            href={item.href} 
                            className="flex items-center gap-3 text-sm font-medium text-foreground/70 hover:text-brand-blue transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue/10 transition-colors">
                              {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4 group-hover:scale-110 transition-transform" })}
                            </div>
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/#metodo" 
              className={`text-sm font-bold transition-colors ${
                isScrolled ? "text-foreground/70 hover:text-brand-blue" : "text-white/80 hover:text-brand-blue"
              }`}
            >
              EL MÉTODO PUDU
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <button className="bg-gradient-fire text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all">
              Digital Upgrade
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-2 mx-6 glass p-6 rounded-3xl md:hidden flex flex-col gap-4 overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                className="flex items-center justify-between text-lg font-black text-foreground py-2"
              >
                SOLUCIONES
                <ChevronDown className={`transition-transform duration-300 ${mobileSolutionsOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {mobileSolutionsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-col gap-4 pl-4 border-l border-brand-blue/20 mb-4"
                  >
                    <div className="mt-2">
                      <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-3">Ecosistemas SIO</p>
                      <div className="grid gap-3">
                        {groupA.map(item => (
                          <Link key={item.name} href={item.href} className="text-sm font-medium text-foreground/70" onClick={() => setMobileMenuOpen(false)}>
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-3">Técnicas a Medida</p>
                      <div className="grid gap-3">
                        {groupB.map(item => (
                          <Link key={item.name} href={item.href} className="text-sm font-medium text-foreground/70" onClick={() => setMobileMenuOpen(false)}>
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                href="/#metodo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-black text-foreground py-2 border-t border-white/5"
              >
                EL MÉTODO PUDU
              </Link>
            </div>
            
            <button className="bg-gradient-fire text-white px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest mt-4 shadow-lg">
              Solicitar Digital Upgrade
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
