import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Lora } from "next/font/google";

const homepageSerif = Lora({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-homepage-serif",
});

export const metadata: Metadata = {
  title: "Auryes — Những hình dạng đang tiếp diễn",
  description:
    "Auryes là một dự án sáng tạo ở Hà Nội, vẫn tiếp tục đổi hình dạng qua trò chơi, trải nghiệm và những hình thức khác.",
};

const editorialLink =
  "inline-flex min-h-11 items-center gap-3 border-b border-[#8c7054] py-2 text-xs uppercase tracking-[0.2em] text-[#d5c3aa] outline-none transition-colors hover:border-[#f0e6d5] hover:text-[#f0e6d5] focus-visible:ring-2 focus-visible:ring-[#b99972] motion-reduce:transition-none";

function CoffeeVisual() {
  return (
    <figure className="mx-auto w-full max-w-sm lg:mx-0">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src="/coffee/kai-playful.jpg"
          fill
          sizes="(max-width: 1024px) 80vw, 30vw"
          alt="Kai đưa tay về phía máy ảnh với vẻ mặt vui vẻ"
          className="object-cover object-[50%_62%]"
        />
      </div>
      <figcaption className="mt-4 text-[0.6rem] uppercase tracking-[0.22em] text-[#695746]">
        Một trò chơi nhỏ của Kai
      </figcaption>
    </figure>
  );
}

function SocialGameVisual() {
  return (
    <div
      className="relative mx-auto flex aspect-[4/5] w-full max-w-sm items-center justify-center border border-[#5a4939] bg-[#100d0b] lg:mx-0"
      aria-label="31 Lá, After Hours Hanoi, August 2026"
    >
      <div className="absolute inset-4 border border-[#3b3027]" aria-hidden="true" />
      <div className="relative text-center">
        <span className="block [font-family:var(--font-homepage-serif)] text-[clamp(7rem,24vw,11rem)] leading-[0.72] text-[#b09370]">
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

export default function HomePage() {
  return (
    <main
      lang="vi"
      className={`${homepageSerif.variable} overflow-x-clip bg-[#0b0908] text-[#eee4d4] selection:bg-[#9a7958] selection:text-[#0b0908]`}
    >
      <section className="flex min-h-[88svh] flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
        <header className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.26em] text-[#6f5c4a]">
          <span>Auryes</span>
          <span>Hanoi</span>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center py-14 text-center sm:py-20">
          <div className="relative mb-9 aspect-square w-[clamp(9rem,25vw,15rem)] sm:mb-12">
            <Image
              src="/logo.jpg"
              fill
              priority
              sizes="(max-width: 640px) 144px, (max-width: 1024px) 25vw, 240px"
              alt="Auryes mark"
              className="object-contain object-center"
            />
          </div>
          <h1 className="text-[clamp(4.1rem,17vw,11rem)] font-medium leading-[0.78] tracking-[-0.085em]">
            AURYES
          </h1>
          <p className="mt-8 max-w-xl [font-family:var(--font-homepage-serif)] text-[clamp(1.35rem,3.2vw,2rem)] italic leading-snug text-[#a28b72]">
            vẫn tiếp tục đổi hình dạng.
          </p>
          <a href="#current" className={`${editorialLink} mt-10`}>
            Xem những gì đang diễn ra <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section id="current" className="border-t border-[#2b241e] px-5 py-24 sm:px-8 md:py-32 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[#8d7660]">
                Đang diễn ra
              </p>
              <h2 className="mt-5 [font-family:var(--font-homepage-serif)] text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.95] text-[#e3d7c5]">
                Những trò đang mở.
              </h2>
            </div>
            <Link href="/game" className={editorialLink}>
              Xem tất cả trò chơi <span aria-hidden="true">→</span>
            </Link>
          </header>

          <div className="mt-20 space-y-28 md:mt-28 md:space-y-36">
            <article className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <CoffeeVisual />
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-[#876f59]">
                  Coffee / khoảng 2 phút
                </p>
                <h3 className="mt-7 max-w-xl [font-family:var(--font-homepage-serif)] text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] text-[#eee4d4]">
                  Có vẻ chúng ta hợp kiểu nào nhỉ?
                </h3>
                <p className="mt-7 max-w-lg text-base leading-7 text-[#998875]">
                  Một trò chơi nhỏ về cách bạn suy nghĩ và phản ứng khi ở gần một người khác.
                </p>
                <Link href="/game/coffee" className={`${editorialLink} mt-9`}>
                  Chơi thử <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            <article className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:order-2 lg:col-span-5 lg:col-start-8">
                <SocialGameVisual />
              </div>
              <div className="lg:order-1 lg:col-span-6">
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-[#876f59]">
                  31 Lá / After Hours · Hanoi / 08.08.2026
                </p>
                <h3 className="mt-7 [font-family:var(--font-homepage-serif)] text-[clamp(3rem,9vw,6rem)] leading-[0.9] text-[#eee4d4]">
                  Có ai ở đây làm bạn tò mò không?
                </h3>
                <p className="mt-7 text-base leading-7 text-[#998875]">
                  Chọn họ. Bốc 1 lá.
                </p>
                <Link href="/game/social-game" className={`${editorialLink} mt-9`}>
                  Vào trải nghiệm <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b241e] px-5 py-24 sm:px-8 md:py-32 lg:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-12 md:gap-16">
          <figure className="mx-auto w-full max-w-xs md:col-span-4 md:mx-0">
            <div className="relative aspect-[3/4]">
              <Image
                src="/ao-detail.jpg"
                fill
                sizes="(max-width: 768px) 80vw, 27vw"
                alt="Chi tiết chất liệu của Trạch Đạo"
                className="object-cover object-center saturate-[0.72]"
              />
            </div>
            <figcaption className="mt-4 text-[0.6rem] uppercase tracking-[0.22em] text-[#695746]">
              Trạch Đạo / detail
            </figcaption>
          </figure>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-[0.65rem] uppercase tracking-[0.26em] text-[#876f59]">
              2025 / Earlier form / Clothing
            </p>
            <h2 className="mt-6 [font-family:var(--font-homepage-serif)] text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.92] text-[#d8cbb8]">
              Trước những trò chơi, Auryes từng mang hình dáng này.
            </h2>
            <Link href="/archive/trach-dao" className={`${editorialLink} mt-9`}>
              Xem Trạch Đạo trong archive <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#2b241e] px-5 pb-10 pt-24 sm:px-8 md:pt-32 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="max-w-3xl [font-family:var(--font-homepage-serif)] text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] text-[#d8cbb8]">
            Auryes keeps changing form.
          </p>
          <nav
            className="mt-20 flex flex-wrap gap-x-7 gap-y-4 border-t border-[#2b241e] pt-7 text-[0.6rem] uppercase tracking-[0.18em] text-[#776451]"
            aria-label="Essential links"
          >
            <Link href="/game" className="min-h-11 py-3 outline-none hover:text-[#eee4d4] focus-visible:ring-2 focus-visible:ring-[#b99972]">Games</Link>
            <Link href="/game/coffee" className="min-h-11 py-3 outline-none hover:text-[#eee4d4] focus-visible:ring-2 focus-visible:ring-[#b99972]">Coffee</Link>
            <Link href="/game/social-game" className="min-h-11 py-3 outline-none hover:text-[#eee4d4] focus-visible:ring-2 focus-visible:ring-[#b99972]">31 Lá</Link>
            <Link href="/archive/trach-dao" className="min-h-11 py-3 outline-none hover:text-[#eee4d4] focus-visible:ring-2 focus-visible:ring-[#b99972]">Trạch Đạo</Link>
            <a href="https://instagram.com/auryes.vn" className="min-h-11 py-3 outline-none hover:text-[#eee4d4] focus-visible:ring-2 focus-visible:ring-[#b99972]">Instagram</a>
            <a href="https://www.facebook.com/auryes.vn/" className="min-h-11 py-3 outline-none hover:text-[#eee4d4] focus-visible:ring-2 focus-visible:ring-[#b99972]">Facebook</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
