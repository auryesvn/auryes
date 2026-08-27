import type { Metadata } from "next";

import "./3288.css";

const faviconUrl = "/3288-fav.ico?v=1";

export const metadata: Metadata = {
  metadataBase: new URL("https://3288.site"),
  icons: {
    icon: [
      {
        url: faviconUrl,
        type: "image/x-icon",
        sizes: "128x128",
      },
    ],
    shortcut: [faviconUrl],
  },
};

export default function UniverseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div lang="vi">{children}</div>;
}
