import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Auryes — An evolving archive",
  description: "A chronology of Auryes forms, from Trạch Đạo to 31 Lá.",
};

type Chapter = {
  date: string;
  dateTime: string;
  state: string;
  title: string;
  description: string;
  secondary?: string;
  metadata: string[];
  href: string;
  linkLabel: string;
  visual: "image" | "typographic";
};

const CHAPTERS: Chapter[] = [
  {
    date: "2025",
    dateTime: "2025",
    state: "EARLIER FORM",
    title: "TRẠCH ĐẠO",
    description: "An earlier form.",
    metadata: ["Clothing", "2025"],
    href: "/archive/trach-dao",
    linkLabel: "View archive",
    visual: "image",
  },
  {
    date: "2026.08",
    dateTime: "2026-08",
    state: "CURRENT FORM",
    title: "31 LÁ",
    description: "Có ai ở đây làm bạn tò mò không?",
    secondary: "Chọn họ. Bốc 1 lá.",
    metadata: ["After Hours · Hanoi", "08.08.2026"],
    href: "/experience/social-game",
    linkLabel: "Enter experience",
    visual: "typographic",
  },
];

const linkStyles =
  "inline-flex items-center gap-3 border-b border-[#8c7054] pb-1 text-xs uppercase tracking-[0.2em] text-[#d5c3aa] outline-none transition-colors duration-200 hover:border-[#f0e6d5] hover:text-[#f0e6d5] focus-visible:ring-2 focus-visible:ring-[#b99972] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0908] motion-reduce:transition-none";

function ChapterMeta({ chapter }: { chapter: Chapter }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.65rem] uppercase tracking-[0.24em] text-[#876f59]">
      <time dateTime={chapter.dateTime}>{chapter.date}</time>
      <span className="h-px w-7 bg-[#574637]" aria-hidden="true" />
      <span>{chapter.state}</span>
    </div>
  );
}

function ChapterVisual({ chapter }: { chapter: Chapter }) {
  if (chapter.visual === "image") {
    return (
      <figure className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
        <div className="absolute -inset-3 border border-[#574637]/45" aria-hidden="true" />
        <Image
          src="/ao-detail.jpg"
          width={1536}
          height={2048}
          sizes="(max-width: 1024px) 88vw, 40vw"
          alt="Chi tiết chất liệu của Trạch Đạo"
          className="relative aspect-[3/4] h-auto w-full object-cover object-center saturate-[0.72]"
        />
        <figcaption className="mt-5 text-[0.62rem] uppercase tracking-[0.22em] text-[#695746]">
          Trạch Đạo / detail
        </figcaption>
      </figure>
    );
  }

  return (
    <div
      className="relative mx-auto flex aspect-[4/5] w-full max-w-md items-center justify-center border border-[#5a4939] bg-[#100d0b] lg:mx-0 lg:max-w-none"
      aria-label="31 Lá, After Hours Hanoi, August 2026"
    >
      <div className="absolute inset-4 border border-[#3b3027]" aria-hidden="true" />
      <div className="relative text-center">
        <span className="block font-serif text-[clamp(7rem,28vw,12rem)] leading-[0.72] tracking-[-0.09em] text-[#b09370]">
          31
        </span>
        <span className="mt-7 block text-sm uppercase tracking-[0.58em] text-[#e3d7c5]">
          Lá
        </span>
      </div>
      <span className="absolute bottom-7 left-7 text-[0.58rem] uppercase tracking-[0.22em] text-[#695746]">
        After Hours / Hanoi
      </span>
    </div>
  );
}

function ChapterSection({ chapter, index }: { chapter: Chapter; index: number }) {
  const visualFirst = index % 2 === 1;

  return (
    <article className="mx-auto grid min-h-svh w-full max-w-6xl items-center gap-16 px-5 py-28 sm:px-8 md:py-36 lg:grid-cols-12 lg:gap-14 lg:px-10">
      <div
        className={`lg:col-span-5 ${visualFirst ? "lg:order-2 lg:col-start-8" : "lg:col-start-1"}`}
      >
        <ChapterVisual chapter={chapter} />
      </div>

      <div
        className={`flex flex-col items-start lg:col-span-5 ${
          visualFirst ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"
        }`}
      >
        <ChapterMeta chapter={chapter} />
        <h2 className="mt-10 font-serif text-[clamp(3.6rem,12vw,7.5rem)] leading-[0.88] tracking-[-0.06em] text-[#eee4d4]">
          {chapter.title}
        </h2>
        <p className="mt-9 max-w-md font-serif text-[clamp(1.45rem,4vw,2.25rem)] leading-[1.25] text-[#c9b9a3]">
          {chapter.description}
        </p>
        {chapter.secondary && (
          <p className="mt-3 text-sm leading-7 tracking-[0.03em] text-[#8f7a64]">
            {chapter.secondary}
          </p>
        )}

        <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-[0.65rem] uppercase tracking-[0.18em] text-[#705e4d]">
          {chapter.metadata.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <Link href={chapter.href} className={`${linkStyles} mt-12`}>
          {chapter.linkLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="overflow-x-clip bg-[#0b0908] text-[#eee4d4] selection:bg-[#9a7958] selection:text-[#0b0908]">
      <section className="relative flex min-h-svh flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
        <div className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.26em] text-[#6f5c4a]">
          <span>Auryes archive</span>
          <span>Hanoi</span>
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-12 aspect-square w-[clamp(10.5rem,28vw,17.5rem)] overflow-hidden rounded-full border border-[#8c7054]/25 shadow-[0_0_70px_rgba(139,105,70,0.12)]">
            <Image
              src="/logo.jpg"
              fill
              priority
              sizes="(max-width: 640px) 168px, (max-width: 1024px) 28vw, 280px"
              alt="Auryes mark"
              className="scale-[1.42] object-cover object-[50%_42%]"
            />
          </div>
          <h1 className="text-[clamp(4.3rem,18vw,12.5rem)] font-medium leading-[0.78] tracking-[-0.085em] text-[#eee4d4]">
            AURYES
          </h1>
          <p className="mt-9 font-serif text-[clamp(1.3rem,3.2vw,2rem)] italic tracking-[-0.025em] text-[#a28b72]">
            an evolving archive
          </p>
          <p className="mt-6 text-[0.68rem] uppercase tracking-[0.3em] text-[#705d4b]">
            2025 — 2026 →
          </p>
        </div>

        <a
          href="#chronology"
          className="mx-auto flex flex-col items-center gap-3 text-[0.58rem] uppercase tracking-[0.25em] text-[#695746] outline-none transition-colors hover:text-[#b29a7d] focus-visible:ring-2 focus-visible:ring-[#b99972] motion-reduce:transition-none"
        >
          Scroll
          <span className="h-10 w-px bg-[#594839]" aria-hidden="true" />
        </a>
      </section>

      <div id="chronology" className="border-t border-[#2b241e]">
        {CHAPTERS.map((chapter, index) => (
          <div key={chapter.date}>
            <ChapterSection chapter={chapter} index={index} />
            {index === 0 && (
              <aside className="flex min-h-[55svh] items-center justify-center px-5 py-32 text-center">
                <p className="font-serif text-[clamp(1.5rem,4vw,2.4rem)] italic text-[#735f4d]">
                  things change form.
                </p>
              </aside>
            )}
          </div>
        ))}
      </div>

      <footer className="border-t border-[#2b241e] px-5 pb-10 pt-32 sm:px-8 md:pt-44 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[#705d4b]">
            2025 → ?
          </p>
          <p className="mt-8 max-w-lg font-serif text-[clamp(2.2rem,7vw,4.8rem)] leading-[0.98] tracking-[-0.045em] text-[#d8cbb8]">
            Auryes keeps changing form.
          </p>

          <nav
            className="mt-28 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#2b241e] pt-8 text-[0.62rem] uppercase tracking-[0.2em] text-[#776451]"
            aria-label="Essential links"
          >
            <Link href="/archive/trach-dao" className="outline-none hover:text-[#eee4d4] focus-visible:ring-2 focus-visible:ring-[#b99972]">
              Trạch Đạo
            </Link>
            <Link href="/experience/social-game" className="outline-none hover:text-[#eee4d4] focus-visible:ring-2 focus-visible:ring-[#b99972]">
              31 Lá
            </Link>
            <a
              href="https://instagram.com/auryes.vn"
              className="outline-none hover:text-[#eee4d4] focus-visible:ring-2 focus-visible:ring-[#b99972]"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/auryes.vn/"
              className="outline-none hover:text-[#eee4d4] focus-visible:ring-2 focus-visible:ring-[#b99972]"
            >
              Facebook
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
