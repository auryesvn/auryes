"use client";

import { useEffect, useState } from "react";

type StickyContactCtaProps = {
  href: string;
  targetId: string;
};

export default function StickyContactCta({
  href,
  targetId,
}: StickyContactCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);

    if (!target || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-3 transition-[transform,opacity] duration-200 motion-reduce:transition-none sm:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <a
        href={href}
        download
        tabIndex={visible ? 0 : -1}
        className="mx-auto flex min-h-14 w-full max-w-sm items-center justify-center rounded-xl bg-[#171411] px-5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#fff9ed] shadow-[0_12px_35px_rgba(38,29,21,0.28)] outline-none focus-visible:ring-2 focus-visible:ring-[#b72c24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3eddf]"
      >
        Lưu Kai vào danh bạ
      </a>
    </div>
  );
}
