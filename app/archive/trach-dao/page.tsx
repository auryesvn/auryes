"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    const brandText = document.getElementById("brandText");
    const links = document.querySelectorAll(".nav-link");
    const menuBtn = document.getElementById("menuBtn");
    const mobilePanel = document.getElementById("mobilePanel");

    function onScroll() {
      const scrolled = window.scrollY > 24;

      if (scrolled) {
        nav?.classList.add(
          "backdrop-blur",
          "bg-white/85",
          "shadow-sm",
          "border-b",
          "border-black/5",
        );
        brandText?.classList.remove("text-white");
        brandText?.classList.add("text-gray-900");

        links.forEach((a) => {
          a.classList.remove("text-white/90", "hover:text-white");
          a.classList.add("text-gray-800", "hover:text-gray-900");
        });
      } else {
        nav?.classList.remove(
          "bg-white/85",
          "shadow-sm",
          "border-b",
          "border-black/5",
        );
        brandText?.classList.remove("text-gray-900");
        brandText?.classList.add("text-white");

        links.forEach((a) => {
          a.classList.remove("text-gray-800", "hover:text-gray-900");
          a.classList.add("text-white/90", "hover:text-white");
        });
      }
    }

    function toggleMenu() {
      mobilePanel?.classList.toggle("hidden");
    }

    menuBtn?.addEventListener("click", toggleMenu);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const KEY = "auryesPrimary";
    const DEFAULT = "#a2e0cf";

    const setPrimary = (hex: string) => {
      document.documentElement.style.setProperty("--primary", hex);
      let meta = document.querySelector(
        'meta[name="theme-color"]',
      ) as HTMLMetaElement | null;

      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }

      meta.content = hex;
    };

    const commit = (hex: string) => {
      setPrimary(hex);

      try {
        localStorage.setItem(KEY, hex);
      } catch {}

      const url = new URL(window.location.href);
      url.searchParams.set("color", hex.replace("#", ""));
      history.replaceState(null, "", url);
    };

    const urlColor = new URLSearchParams(location.search).get("color");

    if (urlColor) {
      setPrimary("#" + urlColor);
    } else {
      try {
        setPrimary(localStorage.getItem(KEY) || DEFAULT);
      } catch {
        setPrimary(DEFAULT);
      }
    }

    const colorBtns = Array.from(document.querySelectorAll("[data-color]"));
    const resetBtns = Array.from(document.querySelectorAll("[data-reset]"));

    const colorHandlers = colorBtns.map((btn) => {
      const hex = btn.getAttribute("data-color") || DEFAULT;

      const mouseenter = () => {
        if (window.matchMedia("(hover:hover)").matches) setPrimary(hex);
      };

      const click = () => commit(hex);

      btn.addEventListener("mouseenter", mouseenter);
      btn.addEventListener("click", click);

      return { btn, mouseenter, click };
    });

    const keydown = (e: KeyboardEvent) => {
      if (["1", "2", "3"].includes(e.key)) {
        const i = Number(e.key) - 1;
        const target = colorBtns[i];
        if (target) commit(target.getAttribute("data-color") || DEFAULT);
      }
    };

    window.addEventListener("keydown", keydown);

    const resetHandlers = resetBtns.map((btn) => {
      const click = () => {
        try {
          localStorage.removeItem(KEY);
        } catch {}

        const url = new URL(window.location.href);
        url.searchParams.delete("color");
        history.replaceState(null, "", url);
        commit(DEFAULT);
      };

      btn.addEventListener("click", click);
      return { btn, click };
    });

    return () => {
      menuBtn?.removeEventListener("click", toggleMenu);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", keydown);
      colorHandlers.forEach(({ btn, mouseenter, click }) => {
        btn.removeEventListener("mouseenter", mouseenter);
        btn.removeEventListener("click", click);
      });
      resetHandlers.forEach(({ btn, click }) =>
        btn.removeEventListener("click", click),
      );
    };
  }, []);

  return (
    <main className="bg-[#f9f9f7] text-gray-800 font-sans">
      <style jsx global>{`
        body {
          letter-spacing: -0.02em;
        }
      `}</style>

      <header
        id="nav"
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      >
        <nav className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <span
                id="brandText"
                className="text-white font-bold tracking-[-0.03em]"
              >
                AURYES™
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#story"
                className="nav-link text-white/90 hover:text-white transition"
              >
                Trạch Đạo v.20
              </a>
              <a
                href="#drop"
                className="nav-link text-white/90 hover:text-white transition"
              >
                Drop
              </a>
              <a
                href="#journal"
                className="nav-link text-white/90 hover:text-white transition"
              >
                Journal
              </a>
              <a
                href="#about"
                className="nav-link text-white/90 hover:text-white transition"
              >
                Về Auryes
              </a>
            </div>

            <button
              id="menuBtn"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>

        <div
          id="mobilePanel"
          className="md:hidden hidden backdrop-blur bg-black/60"
        >
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
            <a href="#story" className="text-white/95 py-2">
              Trạch Đạo
            </a>
            <a href="#drop" className="text-white/95 py-2">
              Drop
            </a>
            <a href="#journal" className="text-white/95 py-2">
              Journal
            </a>
            <a href="#about" className="text-white/95 py-2">
              Về Auryes
            </a>
          </div>
        </div>
      </header>

      <section className="h-screen flex items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-30 bg-gradient-to-tr from-[#a2e0cf] to-transparent" />
        <div className="absolute inset-0 -z-20 bg-gradient-to-tr from-[#d8cbb8] to-transparent rotate-3" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#c6b8d8] to-transparent -rotate-3" />

        <div className="relative z-10 text-gray-800 px-6">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">
            Trạch Đạo 擇道
          </h1>
          <p className="text-lg md:text-xl italic">
            Chọn một &quot;phe&quot; – không để chống lại ai, mà để không chống
            lại chính mình.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 select-none">
            <button
              className="w-7 h-7 rounded-full ring-1 ring-black/10 bg-[#a2e0cf]"
              data-color="#a2e0cf"
              aria-label="Chọn Mint"
            />
            <button
              className="w-7 h-7 rounded-full ring-1 ring-black/10 bg-[#d8cbb8]"
              data-color="#d8cbb8"
              aria-label="Chọn Be"
            />
            <button
              className="w-7 h-7 rounded-full ring-1 ring-black/10 bg-[#c6b8d8]"
              data-color="#c6b8d8"
              aria-label="Chọn Lavender"
            />
            <button
              className="ml-2 px-3 py-1 text-xs rounded-full border border-black/10 text-gray-600 hover:bg-gray-50"
              data-reset
            >
              mặc định
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white text-center" id="story">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
            Một lựa chọn – không dành cho số đông
          </p>
          <h2 className="text-3xl font-semibold mb-4">
            Chiếc áo đầu tiên không sinh ra để bán
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Tối hôm đó, tôi chợt nhận ra... mình cần một chiếc áo để mặc khi ra
            sân – nhưng không phải để khoe style.
            <br />
            <br />
            Tôi cần một chiếc áo để hiện thân sống thật. Một chiếc áo mà mỗi góc
            nhìn đều toát ra cảm giác: <em>&quot;Tao không cần gồng.&quot;</em>
          </p>

          <div className="mt-10 border-l-4 border-gray-300 pl-4 italic text-gray-600 text-left">
            “Trạch Đạo – là chọn một bên, không phải để chống chọi thế lực nào.
            Mà là để đứng yên – và không phản bội chính mình.”
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#f9f9f7] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-semibold mb-6">
            Trụ vững trên sân.
            <span className="block text-gray-500 text-xl mt-2">
              Đừng phản bội bản thể.
            </span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed">
            Không có logo to. Không cần hình in ngầu. Không cần slogan rực cháy.
            <br />
            <br />
            Chỉ có 1 form áo vừa vặn, 1 câu nói gọn lỏn — như một vết xăm ngầm
            trên vải. Nó là tuyên ngôn. Cũng là im lặng.
          </p>

          <div className="mt-10 italic text-gray-600 text-base">
            “Một chiếc áo không cần gào thét, nhưng mỗi lần mặc lên đều khiến ta
            nhớ mình là ai.”
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
            Tại sao lại là Trạch Đạo?
          </p>
          <h2 className="text-3xl font-semibold mb-6">
            Đây không phải một chiếc áo – mà là một thế đứng
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed">
            Trạch Đạo 擇道 là drop đầu tiên, nhưng cũng là drop mẹ – nơi mọi
            dòng chảy khác đều dẫn về.
            <br />
            <br />
            Từ đây, những bộ outfit đánh sân, những mẫu áo chill mùa thu, hay
            những bản thiết kế đậm chất Đông phương – tất cả đều nối sóng từ
            Trạch Đạo.
          </p>

          <div className="mt-10 border-l-4 border-gray-300 pl-4 italic text-left text-gray-600">
            “Chỉ khi chọn được đường đi cho riêng mình, thì mọi bước chân sau đó
            mới có điểm neo để trở về.”
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#f9f9f7] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Điều gì sẽ xảy ra khi bạn mặc chiếc áo này?
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Bạn sẽ không cảm thấy mạnh mẽ hơn.
            <br />
            Bạn chỉ cảm thấy... đúng là mình.
            <br />
            <br />
            Không cần tỏ ra alpha. Không cần phải nổi bật. Nhưng ai cũng sẽ nhận
            ra: bạn đã chọn một phe.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 px-4" id="drop">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-semibold mb-4">Chiếc áo đầu tiên</h2>
          <p className="text-gray-600">
            Visual đầu tiên từ Drop 0.5 – Trạch Đạo 擇道
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-gray-200 bg-[#f9f9f7] p-8 text-center text-gray-500">
            Visual archive đang được giữ lại.
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <Image
            src="/ao-detail.jpg"
            width={1536}
            height={2048}
            alt="Chi tiết áo"
            className="w-full md:w-1/2 rounded-xl shadow-md"
          />
          <div className="md:w-1/2 text-gray-700">
            <h3 className="text-2xl font-semibold mb-4">
              Mỗi đường kim, mỗi phom dáng
            </h3>
            <p className="text-lg leading-relaxed">
              ...đều được tính toán để không phô trương.
              <br />
              Từ chất vải matte, cổ áo đứng vững, cho đến logo được dập nhỏ ở vị
              trí tưởng chừng không ai để ý.
              <br />
              <br />
              Đây là một chiếc áo được làm cho những người không cần được gọi
              tên – nhưng luôn có mặt đúng lúc.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#f9f9f7] text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Không dành cho tất cả
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Những chiếc áo đầu tiên không mở bán đại trà. Nếu bạn cảm thấy mình
            là người nên có mặt ở Drop này – hãy để lại tín hiệu.
          </p>

          <form className="flex flex-col md:flex-row items-center justify-center gap-4">
            <input
              type="tel"
              placeholder="Số di động của bạn"
              className="w-full md:w-2/3 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
            >
              Tôi muốn được báo khi mở bán
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 italic">
            Auryes sẽ không làm phiền bạn. Chúng tôi chỉ gửi tín hiệu đúng lúc.
          </p>
        </div>
      </section>

      <section
        className="py-28 px-6 bg-[#111827] text-white text-center"
        id="journal"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 tracking-wide uppercase text-gray-300">
            Bí mật từ Trạch Đạo
          </h2>
          <p className="text-xl italic leading-relaxed mb-10 text-gray-200">
            “Khi đã chọn một con đường, bạn không cần phải hét to cho thế giới
            biết. Chỉ cần bước đi – từng bước một – và để khí của bạn kể phần
            còn lại.”
          </p>

          <a
            href="#"
            className="text-sm text-gray-400 underline hover:text-white transition"
          >
            Truy cập bản nhật ký Trạch Đạo
          </a>
        </div>
      </section>

      <footer
        className="bg-[#0f172a] text-gray-400 text-sm text-center py-10 px-4"
        id="about"
      >
        <div className="max-w-4xl mx-auto">
          <p className="mb-3 italic">
            “Bố mày không cần nói nhiều.” – một cách sống không dành cho số
            đông.
          </p>

          <div className="flex justify-center gap-6 mt-6 text-gray-500 text-xs">
            <a
              href="https://www.facebook.com/auryes.vn/"
              className="hover:text-white transition"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/auryes.vn"
              className="hover:text-white transition"
            >
              Instagram
            </a>
            <a href="#" className="hover:text-white transition">
              TikTok
            </a>
            <a href="#" className="hover:text-white transition">
              Journal
            </a>
            <a href="#" className="hover:text-white transition">
              Về Auryes
            </a>
          </div>

          <div className="mt-6 text-gray-600 text-xs">
            © 2025 Auryes – Trạch Đạo 擇道. Một dự án bởi 3288 Courtwear.
          </div>
        </div>
      </footer>
    </main>
  );
}
