"use client";

import Link from "next/link";
import { Instagram, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingConversionBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const blockedSections = ["diagnostico", "contacto"];
      const isBlocked = blockedSections.some((id) => {
        const element = document.getElementById(id);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });

      setIsVisible(window.scrollY > window.innerHeight * 0.75 && !isBlocked);
    };

    const initialFrame = window.requestAnimationFrame(updateVisibility);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/90 p-1.5 text-white shadow-2xl backdrop-blur-xl transition duration-300 md:bottom-6 md:left-auto md:right-6 md:translate-x-0 md:gap-2 md:p-2 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Link
        href="/#contacto"
        tabIndex={isVisible ? 0 : -1}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-fire px-4 py-2.5 text-[11px] font-black md:px-5 md:py-3 md:text-xs"
      >
        <MessageCircleMore className="h-4 w-4" />
        Diagnóstico gratis
      </Link>
      <a
        href="https://www.instagram.com/puduitsolutions/"
        target="_blank"
        rel="noreferrer"
        aria-label="Escribir a PUDU por Instagram"
        tabIndex={isVisible ? 0 : -1}
        className="hidden h-11 w-11 items-center justify-center rounded-full bg-white/10 text-pink-300 transition hover:bg-pink-400/20 min-[360px]:flex md:h-10 md:w-10"
      >
        <Instagram className="h-4 w-4" />
      </a>
    </div>
  );
}
