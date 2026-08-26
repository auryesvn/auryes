"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useEffect, useRef } from "react";

const MAX_OFFSET = 24;
const PARALLAX_RATE = 0.16;

export default function CoffeeCover() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const imageLayer = imageLayerRef.current;
    if (!container || !imageLayer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let animationFrame: number | null = null;
    const updateOffset = () => {
      animationFrame = null;
      const bounds = container.getBoundingClientRect();
      const offset = Math.max(
        -MAX_OFFSET,
        Math.min(MAX_OFFSET, -bounds.top * PARALLAX_RATE),
      );
      imageLayer.style.setProperty("--coffee-cover-offset", `${offset}px`);
    };
    const requestUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updateOffset);
    };

    updateOffset();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={imageLayerRef}
        className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
        style={
          {
            "--coffee-cover-offset": "0px",
            transform: "translate3d(0,var(--coffee-cover-offset),0)",
          } as CSSProperties
        }
      >
        <Image
          src="/kai/cover.png"
          alt="Góc bàn làm việc của Kai với đàn guitar, sách, tai nghe và vợt pickleball"
          fill
          priority
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover object-[50%_54%]"
        />
      </div>
    </div>
  );
}
