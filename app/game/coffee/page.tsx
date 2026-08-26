import type { Metadata } from "next";
import CoffeeQuiz from "./_components/coffee-quiz";

export const metadata: Metadata = {
  title: "Có vẻ chúng ta hợp kiểu nào nhỉ? — Auryes",
  description:
    "Một trò chơi nhỏ của Auryes để xem hai người có thể hợp kiểu nào.",
  alternates: { canonical: "https://auryes.vn/game/coffee" },
  openGraph: {
    title: "Có vẻ chúng ta hợp kiểu nào nhỉ? — Auryes",
    description:
      "Một trò chơi nhỏ của Auryes để xem hai người có thể hợp kiểu nào.",
    url: "https://auryes.vn/game/coffee",
    locale: "vi_VN",
    type: "website",
  },
};

export default function CoffeePage() {
  return <CoffeeQuiz />;
}
