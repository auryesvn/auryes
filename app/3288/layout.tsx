import type { Metadata } from "next";

import "./3288.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://auryes.vn"),
};

export default function UniverseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div lang="vi">{children}</div>;
}
