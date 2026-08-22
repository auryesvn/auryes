"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";

type Depth = "far" | "mid" | "near";

type HeroDecoration = {
  src: string;
  top: string;
  left?: string;
  right?: string;
  width: number;
  rotate: number;
  scale: number;
  opacity: number;
  depth: Depth;
  rate: number;
  clamp: number;
};

const heroDecorations: readonly HeroDecoration[] = [
  { src: "/kai/bg-1.png", top: "3%", left: "-4%", width: 62, rotate: -18, scale: 0.92, opacity: 0.07, depth: "mid", rate: 0.06, clamp: 10 },
  { src: "/kai/bg-2.png", top: "8%", right: "-7%", width: 76, rotate: 14, scale: 1.08, opacity: 0.065, depth: "near", rate: 0.09, clamp: 14 },
  { src: "/kai/bg-3.png", top: "31%", left: "3%", width: 52, rotate: 9, scale: 0.82, opacity: 0.055, depth: "far", rate: 0.03, clamp: 6 },
  { src: "/kai/bg-4.png", top: "35%", right: "-5%", width: 86, rotate: -12, scale: 1.05, opacity: 0.055, depth: "mid", rate: 0.06, clamp: 10 },
  { src: "/kai/bg-5.png", top: "53%", right: "19%", width: 48, rotate: 20, scale: 0.78, opacity: 0.045, depth: "near", rate: 0.09, clamp: 14 },
  { src: "/kai/bg-6.png", top: "65%", left: "-5%", width: 82, rotate: -8, scale: 1.12, opacity: 0.075, depth: "far", rate: 0.03, clamp: 6 },
  { src: "/kai/bg-7.png", top: "69%", right: "1%", width: 64, rotate: 16, scale: 0.9, opacity: 0.06, depth: "mid", rate: 0.06, clamp: 10 },
  { src: "/kai/bg-8.png", top: "84%", left: "18%", width: 72, rotate: -15, scale: 1.02, opacity: 0.055, depth: "far", rate: 0.03, clamp: 6 },
] as const;

export default function HeroDecorations() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedMotion.matches) return;

    const icons = Array.from(
      layer.querySelectorAll<HTMLElement>("[data-decoration-index]"),
    );
    let animationFrame: number | null = null;

    const updateOffsets = () => {
      animationFrame = null;

      icons.forEach((icon) => {
        const index = Number(icon.dataset.decorationIndex);
        const decoration = heroDecorations[index];
        const offset = Math.max(
          -decoration.clamp,
          Math.min(decoration.clamp, window.scrollY * decoration.rate),
        );
        icon.style.setProperty("--decoration-offset-y", `${offset}px`);
      });
    };

    const requestUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updateOffsets);
    };

    updateOffsets();
    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {heroDecorations.map(
        ({ src, top, left, right, width, rotate, scale, opacity, depth }, index) => (
          <span
            key={src}
            data-decoration-index={index}
            data-depth={depth}
            className="absolute block aspect-square mix-blend-multiply will-change-transform"
            style={
              {
                top,
                left,
                right,
                width,
                opacity,
                "--decoration-offset-y": "0px",
                transform: `translate3d(0, var(--decoration-offset-y), 0) rotate(${rotate}deg) scale(${scale})`,
                filter: "grayscale(1) contrast(0.7) brightness(0.45)",
              } as CSSProperties
            }
          >
            <Image
              src={src}
              alt=""
              fill
              sizes={`${width}px`}
              className="object-contain"
            />
          </span>
        ),
      )}
    </div>
  );
}
