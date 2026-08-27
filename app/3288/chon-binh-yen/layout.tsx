import type { Metadata } from "next";

const canonicalUrl = "https://3288.site/chon-binh-yen";
const description = "Một lời tiễn đưa giữ lại đồng thời nỗi đau và sự thanh thản.";

export const metadata: Metadata = {
  metadataBase: new URL("https://3288.site"),
  title: "Chốn Bình Yên — 3288",
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Chốn Bình Yên — 3288",
    description,
    url: canonicalUrl,
    type: "website",
    locale: "vi_VN",
    images: [{ url: "/chon-binh-yen/opengraph-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chốn Bình Yên — 3288",
    description,
    images: ["/chon-binh-yen/opengraph-image.png"],
  },
};

export default function ChonBinhYenLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div lang="vi">{children}</div>;
}
