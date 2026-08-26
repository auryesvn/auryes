import { Newsreader } from "next/font/google";
import "./coffee.css";

const coffeeSerif = Newsreader({
  subsets: ["latin", "vietnamese"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-coffee-serif",
});

export default function CoffeeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div lang="vi" className={coffeeSerif.variable}>
      {children}
    </div>
  );
}
