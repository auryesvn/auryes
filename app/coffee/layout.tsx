import { Lora } from "next/font/google";

const coffeeSerif = Lora({
  subsets: ["latin", "vietnamese"],
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
