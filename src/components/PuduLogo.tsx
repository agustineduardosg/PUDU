"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PuduLogoProps {
  color?: string;
  hoverColor?: string;
  className?: string;
}

/**
 * PuduLogo Component
 * 
 * Renders the PUDU SVG logo using a CSS mask for dynamic coloring.
 * This approach is used instead of inlining the 100KB+ SVG code to:
 * 1. Maintain application performance and fast initial load (LCP).
 * 2. Allow dynamic coloring via the `backgroundColor` of the mask.
 * 3. Keep the component code clean and manageable.
 */
const PuduLogo = ({ 
  color = '#0F172A', 
  hoverColor = '#10B981',
  className = 'h-10 w-24' 
}: PuduLogoProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className={`relative inline-block cursor-pointer ${className}`}
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
};

export default PuduLogo;
