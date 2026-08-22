import type { Metadata } from "next";
import Image from "next/image";
import { Lora } from "next/font/google";

import ParallaxCover from "./_components/parallax-cover";
import StickyContactCta from "./_components/sticky-contact-cta";
import { kaiProfile } from "./_data/profile";

const kaiSerif = Lora({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-kai-serif",
});

export const metadata: Metadata = {
  title: "Kai Trần — Auryes",
  description:
    "Kai Trần · Nhà thiết kế hệ thống & trải nghiệm · Hà Nội, Việt Nam.",
  alternates: { canonical: kaiProfile.canonical },
  openGraph: {
    title: "Kai Trần — Auryes",
    description:
      "Kai Trần · Nhà thiết kế hệ thống & trải nghiệm · Hà Nội, Việt Nam.",
    url: kaiProfile.canonical,
    type: "profile",
    locale: "vi_VN",
  },
};

const eyebrow =
  "text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#766e63]";
const focus =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#b72c24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f0e3]";
const contactLinks = [
  {
    label: "Instagram",
    href: kaiProfile.instagram,
    external: true,
    icon: "/kai/ig.png",
  },
  {
    label: "Facebook",
    href: kaiProfile.facebook,
    external: true,
    icon: "/kai/fb.png",
  },
  {
    label: kaiProfile.phone.display,
    href: kaiProfile.phone.href,
    external: false,
    icon: "/kai/phone.png",
  },
] as const;

type ArrowUpRightIconProps = {
  className?: string;
};

function ArrowUpRightIcon({ className }: ArrowUpRightIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

const arrowClassName =
  "size-[22px] shrink-0 text-[#171411] transition-transform duration-150 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-focus-visible:translate-x-[2px] group-focus-visible:-translate-y-[2px] motion-reduce:transition-none motion-reduce:transform-none";
const paperPattern =
  "bg-[#f4efe5] [background-image:radial-gradient(circle,rgba(49,40,31,0.13)_0.65px,transparent_0.75px)] [background-size:5px_5px]";

export default function KaiPage() {
  return (
    <main
      lang="vi"
      className={`${kaiSerif.variable} min-h-svh bg-[#ded5c5] text-[#171411] selection:bg-[#b72c24] selection:text-white`}
    >
      <div
        className={`relative mx-auto min-h-svh w-full max-w-md overflow-hidden shadow-[0_0_55px_rgba(45,36,28,0.13)] ${paperPattern}`}
      >
        <header className="relative h-[19rem] overflow-hidden sm:h-[20rem]">
          <ParallaxCover />
          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:radial-gradient(#fff_0.65px,transparent_0.75px)] [background-size:4px_4px]"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-6 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-white/90">
            <span>
              <a href="https://auryes.vn/">Auryes</a>
            </span>
            <span>Nhận diện / 01</span>
          </div>
          <div
            className={`absolute -bottom-7 left-1/2 h-14 w-[116%] -translate-x-1/2 rounded-[50%_50%_0_0/100%_100%_0_0] [background-position:0_calc(-19rem+1.75rem)] sm:[background-position:0_calc(-20rem+1.75rem)] ${paperPattern}`}
            aria-hidden="true"
          />
        </header>

        <section className="relative z-10 -mt-[7.6rem] px-5 text-center">
          <div className="relative mx-auto aspect-[1203/1416] w-[15.25rem] max-w-[72vw]">
            <div
              className="absolute left-[calc(6.82%-8px)] top-[calc(6.50%-8px)] aspect-square w-[calc(85.12%+16px)] rounded-full bg-white shadow-[0_12px_28px_rgba(38,29,21,0.24)]"
              aria-hidden="true"
            />
            <Image
              src="/kai/kai-playful.png"
              alt="Kai đưa tay về phía máy ảnh với vẻ mặt vui vẻ"
              fill
              priority
              sizes="(max-width: 640px) 244px, 244px"
              className="relative z-10 object-contain"
            />
          </div>

          <div className="-mt-5">
            <p className={`${eyebrow} text-[#9f3029]`}>Auryes / Kai 01</p>
            <h1 className="mt-4 [font-family:var(--font-kai-serif)] text-[3.35rem] font-medium leading-[0.9] tracking-[-0.055em]">
              Kai Trần
            </h1>
            <p className="mx-auto mt-5 max-w-xs text-sm font-semibold leading-6">
              {kaiProfile.role}
            </p>
            <p className="mt-1 text-sm text-[#756d62]">{kaiProfile.location}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <a
              id="kai-primary-contact"
              href={kaiProfile.vcard}
              download
              className={`${focus} flex min-h-14 items-center justify-center rounded-xl bg-[#171411] px-4 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#fff9ed]`}
            >
              Lưu liên hệ
            </a>
            <a
              href={kaiProfile.zalo}
              target="_blank"
              rel="noreferrer"
              className={`${focus} flex min-h-14 items-center justify-center rounded-xl border border-[#171411] bg-[#f4efe5] px-4 text-[0.66rem] font-semibold uppercase tracking-[0.14em]`}
            >
              Nhắn Zalo
            </a>
          </div>
        </section>

        <section className="relative mt-11 rounded-t-[2rem] bg-[#f4efe5] px-5 pb-32 pt-14 shadow-[0_-12px_32px_rgba(47,37,27,0.09)] [background-image:none]">
          <div
            className="absolute left-1/2 top-4 h-1 w-10 -translate-x-1/2 rounded-full bg-[#c7bbaa]"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className={eyebrow}>Tớ đang làm những gì:</h2>

            <div className="mt-7 border-t border-[#d8cdbc]">
              <a
                href={kaiProfile.projects.mbmc}
                aria-label="Mở website MBMC"
                className={`${focus} group grid min-h-28 grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-b border-[#d8cdbc] py-5`}
              >
                <span className="relative size-14 overflow-hidden rounded-full">
                  <Image
                    src="/kai/mbmc.jpg"
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <span>
                  <strong className="block text-sm tracking-[0.12em]">
                    MBMC
                  </strong>
                  <span className="mt-1.5 block text-sm leading-5 text-[#756d62]">
                    Một hệ thống tốt hơn cho MacBook cũ
                  </span>
                </span>
                <ArrowUpRightIcon className={arrowClassName} />
              </a>

              <a
                href={kaiProfile.projects.auryes}
                aria-label="Mở website Auryes"
                className={`${focus} group grid min-h-28 grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-b border-[#d8cdbc] py-5`}
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-[#191613]">
                  <Image
                    src="/kai/auryes-logo.png"
                    width={34}
                    height={41}
                    alt="Logo Auryes"
                    className="h-9 w-auto object-contain"
                  />
                </span>
                <span>
                  <strong className="block text-sm tracking-[0.12em]">
                    AURYES
                  </strong>
                  <span className="mt-1.5 block text-sm leading-5 text-[#756d62]">
                    Giao diện kết nối con người, trò chơi &amp; ý tưởng
                  </span>
                </span>
                <ArrowUpRightIcon className={arrowClassName} />
              </a>
            </div>

            <h2 className={`${eyebrow} mt-14`}>Tìm tớ:</h2>
            <nav
              className="mt-5 border-t border-[#d8cdbc]"
              aria-label="Liên hệ với Kai"
            >
              {contactLinks.map(({ label, href, external, icon }) => (
                <a
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className={`${focus} group grid min-h-14 grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-x-3.5 border-b border-[#d8cdbc] text-base`}
                >
                  <span className="relative size-7">
                    <Image
                      src={icon}
                      alt=""
                      fill
                      sizes="28px"
                      className="scale-[1.35] object-contain"
                    />
                  </span>
                  <span>{label}</span>
                  <ArrowUpRightIcon className={arrowClassName} />
                </a>
              ))}
            </nav>

            <footer className="mt-20 flex items-end justify-between gap-5 border-t border-[#d8cdbc] pt-5 text-[0.58rem] uppercase leading-5 tracking-[0.18em] text-[#857b6e]">
              <p>
                Nhận diện Auryes
                <br />
                Kai / 01
              </p>
              <p className="text-right normal-case tracking-[0.08em]">
                auryes.vn/kai
              </p>
            </footer>
          </div>
        </section>

        <StickyContactCta
          href={kaiProfile.vcard}
          targetId="kai-primary-contact"
        />
      </div>
    </main>
  );
}
