import type { Metadata } from "next";

import "./tinh-ma.css";

const canonicalUrl = "https://auryes.vn/3288/tinh-ma";

export const metadata: Metadata = {
  metadataBase: new URL("https://auryes.vn"),
  title: "Tình Ma — 3288",
  description:
    "Em không còn ở đây. Nhưng tình yêu ấy vẫn biết cách quay về.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Tình Ma — 3288",
    description:
      "Em không còn ở đây. Nhưng tình yêu ấy vẫn biết cách quay về.",
    url: canonicalUrl,
    type: "website",
    locale: "vi_VN",
    images: [{ url: "/3288/tinh-ma/opengraph-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tình Ma — 3288",
    description:
      "Em không còn ở đây. Nhưng tình yêu ấy vẫn biết cách quay về.",
    images: ["/3288/tinh-ma/opengraph-image.png"],
  },
};

export default function TinhMaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div lang="vi">{children}</div>;
}
