"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackConversion } from "@/lib/analytics/client";

type TrackedConversionLinkProps = {
  children: ReactNode;
  className?: string;
  cta: string;
  destination: string;
  href: string;
};

export function TrackedConversionLink({
  children,
  className,
  cta,
  destination,
  href,
}: TrackedConversionLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackConversion("CTA_CLICK", {
          cta,
          destination,
        })
      }
    >
      {children}
    </Link>
  );
}
