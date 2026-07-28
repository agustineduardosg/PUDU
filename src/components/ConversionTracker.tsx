"use client";

import { useEffect } from "react";
import { trackConversion } from "@/lib/analytics/client";

export function ConversionTracker() {
  useEffect(() => {
    const pageKey = `pudu_page_view:${window.location.pathname}${window.location.search}`;

    if (!window.sessionStorage.getItem(pageKey)) {
      window.sessionStorage.setItem(pageKey, "1");
      trackConversion("PAGE_VIEW");
    }
  }, []);

  return null;
}
