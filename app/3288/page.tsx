import type { Metadata } from "next";

import { UniverseHome } from "./_components/universe-home";

const canonicalUrl = "https://3288.site";

export const metadata: Metadata = {
  title: "3288 — Những thế giới",
  description: "Một bài hát là một thế giới.",
  alternates: { canonical: canonicalUrl },
  openGraph: { title: "3288 — Những thế giới", description: "Một bài hát là một thế giới.", url: canonicalUrl, type: "website", locale: "vi_VN" },
  twitter: { card: "summary", title: "3288 — Những thế giới", description: "Một bài hát là một thế giới." },
};

export default function UniversePage() {
  return <UniverseHome />;
}
