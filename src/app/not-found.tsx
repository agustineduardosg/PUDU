import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-brand-fire-start/10 border border-brand-fire-start/20 mb-8">
            <Compass className="w-12 h-12 text-brand-fire-end animate-pulse" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            404
          </h1>
          
          <h2 className="text-2xl md:text-4xl font-bold mb-8 text-foreground/80">
            Página fuera de rango operacional.
          </h2>
          
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto mb-12">
            El Prime Utility Digital Upgrade que buscas no se encuentra en esta ruta. 
            Probablemente ha sido migrado a un nuevo ecosistema o el enlace ha expirado.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-black text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Home className="w-5 h-5" /> Regresar al Inicio
            </Link>
            
            <Link 
              href="/#industrias"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border/10 font-bold transition-all hover:bg-foreground/5"
            >
              <ArrowLeft className="w-5 h-5" /> Ver Industrias
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
