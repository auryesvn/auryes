"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";

const MAX_OFFSET = 60;
const PARALLAX_RATE = 0.4;

export default function ParallaxCover() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const imageLayer = imageLayerRef.current;

    if (!container || !imageLayer) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedMotion.matches) {
      imageLayer.style.setProperty("--parallax-offset", "0px");
      return;
    }

    let animationFrame: number | null = null;

    const updateOffset = () => {
      animationFrame = null;
      const bounds = container.getBoundingClientRect();

      if (bounds.bottom < -100 || bounds.top > window.innerHeight + 100) {
        return;
      }

      const relativeScroll = -bounds.top;
      const offset = Math.max(
        -MAX_OFFSET,
        Math.min(MAX_OFFSET, relativeScroll * PARALLAX_RATE),
      );
      imageLayer.style.setProperty("--parallax-offset", `${offset}px`);
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
        className="absolute inset-x-0 -top-[25%] h-[150%] will-change-transform"
        style={
          {
            "--parallax-offset": "0px",
            transform: "translate3d(0, var(--parallax-offset), 0)",
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
