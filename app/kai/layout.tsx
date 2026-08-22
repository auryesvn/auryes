import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://auryes.vn"),
};

export default function KaiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
