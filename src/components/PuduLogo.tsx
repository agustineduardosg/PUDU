"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PuduLogoProps {
  color?: string;
  hoverColor?: string;
  className?: string;
  href?: string;
}

/**
 * PuduLogo Component
 * 
 * Renders the PUDU SVG logo using a CSS mask for dynamic coloring.
 */
const PuduLogo = ({ 
  color = '#0F172A', 
  hoverColor = '#10B981',
  className = 'h-10 w-24',
  href,
}: PuduLogoProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const logo = (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className={`relative ${className}`}
    >
      <div
        className="w-full h-full transition-colors duration-500"
        style={{
          backgroundColor: isHovered ? hoverColor : color,
          maskImage: 'url(/logo-pudu.svg)',
          maskRepeat: 'no-repeat',
          maskSize: 'contain',
          maskPosition: 'center',
          WebkitMaskImage: 'url(/logo-pudu.svg)',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          WebkitMaskPosition: 'center',
        }}
      />
    </motion.div>
  );

  return href ? (
    <Link href={href} className="inline-block">
      {logo}
    </Link>
  ) : logo;
};

export default PuduLogo;
