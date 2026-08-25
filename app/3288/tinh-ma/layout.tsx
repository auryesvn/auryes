import type { Metadata } from "next";

const canonicalUrl = "https://3288.site/tinh-ma";

export const metadata: Metadata = {
  metadataBase: new URL("https://3288.site"),
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
    images: [{ url: "/tinh-ma/opengraph-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tình Ma — 3288",
    description:
      "Em không còn ở đây. Nhưng tình yêu ấy vẫn biết cách quay về.",
    images: ["/tinh-ma/opengraph-image.png"],
  },
};

export default function TinhMaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div lang="vi">{children}</div>;
}
