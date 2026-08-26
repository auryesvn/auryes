import type { ReactNode } from "react";

export const COFFEE_PAPER_PATTERN =
  "bg-[#f4efe5] [background-image:radial-gradient(circle,rgba(49,40,31,0.13)_0.65px,transparent_0.75px)] [background-size:5px_5px]";

export default function CoffeeFrame({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-svh bg-[#ded5c5] text-[#171411] selection:bg-[#b72c24] selection:text-white">
      <div
        className={`relative mx-auto min-h-svh w-full max-w-md overflow-hidden shadow-[0_0_55px_rgba(45,36,28,0.13)] ${COFFEE_PAPER_PATTERN}`}
      >
        {children}
      </div>
    </main>
  );
}
