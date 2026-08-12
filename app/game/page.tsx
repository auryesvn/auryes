import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Games — Auryes",
  description: "Những trò chơi nhỏ của Auryes.",
};

const games = [
  {
    eyebrow: "Một trò chơi nhỏ của Kai",
    title: "Có vẻ chúng ta hợp kiểu nào nhỉ?",
    href: "/game/coffee",
  },
  {
    eyebrow: "31 lá",
    title: "Có ai ở đây làm bạn tò mò không?",
    href: "/game/social-game",
  },
] as const;

export default function GamesPage() {
  return (
    <main className="min-h-svh bg-[#0b0908] px-5 py-8 text-[#eee4d4] sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.26em] text-[#6f5c4a]">
          <Link
            href="/"
            className="outline-none hover:text-[#b29a7d] focus-visible:ring-2 focus-visible:ring-[#b99972]"
          >
            Auryes
          </Link>
          <span>Games</span>
        </header>

        <section className="my-auto py-20">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[#8d7660]">
            Những trò chơi nhỏ
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-[clamp(3.5rem,11vw,7.5rem)] leading-[0.9] text-[#eee4d4]">
            Chọn một trò rồi chơi.
          </h1>

          <div className="mt-16 border-t border-[#2b241e]">
            {games.map((game, index) => (
              <Link
                key={game.href}
                href={game.href}
                className="group grid gap-4 border-b border-[#2b241e] py-8 outline-none sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-8 sm:py-10 focus-visible:ring-2 focus-visible:ring-[#b99972]"
              >
                <span className="font-mono text-xs text-[#574637]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-[#705d4b]">
                    {game.eyebrow}
                  </span>
                  <span className="mt-3 block font-serif text-[clamp(1.65rem,5vw,2.8rem)] leading-tight text-[#cfc1ae] transition-colors group-hover:text-[#eee4d4] motion-reduce:transition-none">
                    {game.title}
                  </span>
                </span>
                <span className="text-[#8c7054] transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
