"use client";
import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

export function BookCall({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  useEffect(() => {
    const id = "calendly-widget-script";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  function open() {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: siteConfig.calendlyUrl });
    } else {
      window.open(siteConfig.calendlyUrl, "_blank", "noopener");
    }
  }

  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
