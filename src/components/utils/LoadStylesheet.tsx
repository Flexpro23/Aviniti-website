"use client";

import { useEffect } from "react";

interface LoadStylesheetProps {
  href: string;
  media?: string;
}

export default function LoadStylesheet({ href, media = "all" }: LoadStylesheetProps) {
  useEffect(() => {
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = href;
    linkEl.media = media;
    document.head.appendChild(linkEl);
    return () => {
      try {
        document.head.removeChild(linkEl);
      } catch {
        // ignore
      }
    };
  }, [href, media]);

  return null;
}


