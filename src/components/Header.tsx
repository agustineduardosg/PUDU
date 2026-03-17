"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import PuduLogo from "./PuduLogo";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Industrias", href: "/#industrias" },
    { name: "Servicios", href: "/#servicios" },
    { name: "El método PUDU", href: "/#metodo" },
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
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isScrolled 
                    ? "text-foreground/70 hover:text-brand-emerald" 
                    : "text-white/80 hover:text-brand-emerald"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <button className="bg-gradient-fire text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all">
              Obtén tu actualización
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
            className="absolute top-full left-0 right-0 mt-2 mx-6 glass p-6 rounded-3xl md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-foreground border-b border-foreground/10 pb-2"
              >
                {link.name}
              </a>
            ))}
            <button className="bg-gradient-fire text-white px-6 py-3 rounded-xl text-lg font-bold mt-2 shadow-lg">
              Obtén tu actualización
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
