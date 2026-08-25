export type CatalogueStatus = "live" | "forming";

export type CatalogueSong = {
  title: string;
  slug: string;
  artwork: `/3288/catalogue/${string}.jpg`;
  status: CatalogueStatus;
  route: "/tinh-ma" | null;
  position: { x: number; y: number };
};

// Positions are layout-only and deterministic. They do not express semantic,
// emotional, chronological, or creative relationships between songs.
export const catalogueSongs = [
  { title: "Tình Mơ", slug: "tinh-mo", artwork: "/3288/catalogue/tinh-mo.jpg", status: "forming", route: null, position: { x: 8, y: 15 } },
  { title: "Giữ Mình Anh", slug: "giu-minh-anh", artwork: "/3288/catalogue/giu-minh-anh.jpg", status: "forming", route: null, position: { x: 25, y: 15 } },
  { title: "Mùa Đông Và Mưa", slug: "mua-dong-va-mua", artwork: "/3288/catalogue/mua-dong-va-mua.jpg", status: "forming", route: null, position: { x: 42, y: 15 } },
  { title: "Vết Son", slug: "vet-son", artwork: "/3288/catalogue/vet-son.jpg", status: "forming", route: null, position: { x: 59, y: 15 } },
  { title: "Đêm Vắng 2", slug: "dem-vang-2", artwork: "/3288/catalogue/dem-vang-2.jpg", status: "forming", route: null, position: { x: 76, y: 15 } },
  { title: "NCL ANE", slug: "ncl-ane", artwork: "/3288/catalogue/ncl-ane.jpg", status: "forming", route: null, position: { x: 93, y: 15 } },
  { title: "Tình Ma", slug: "tinh-ma", artwork: "/3288/catalogue/tinh-ma.jpg", status: "live", route: "/tinh-ma", position: { x: 8, y: 50 } },
  { title: "It's A Match", slug: "its-a-match", artwork: "/3288/catalogue/its-a-match.jpg", status: "forming", route: null, position: { x: 25, y: 50 } },
  { title: "Mưa Rơi", slug: "mua-roi", artwork: "/3288/catalogue/mua-roi.jpg", status: "forming", route: null, position: { x: 42, y: 50 } },
  { title: "Chốn Bình Yên", slug: "chon-binh-yen", artwork: "/3288/catalogue/chon-binh-yen.jpg", status: "forming", route: null, position: { x: 59, y: 50 } },
  { title: "Đêm Qua Mơ Về Em", slug: "dem-qua-mo-ve-em", artwork: "/3288/catalogue/dem-qua-mo-ve-em.jpg", status: "forming", route: null, position: { x: 76, y: 50 } },
  { title: "Em không trả lời", slug: "em-khong-tra-loi", artwork: "/3288/catalogue/em-khong-tra-loi.jpg", status: "forming", route: null, position: { x: 93, y: 50 } },
  { title: "It's Better", slug: "its-better", artwork: "/3288/catalogue/its-better.jpg", status: "forming", route: null, position: { x: 8, y: 85 } },
  { title: "Lượn đêm", slug: "luon-dem", artwork: "/3288/catalogue/luon-dem.jpg", status: "forming", route: null, position: { x: 25, y: 85 } },
  { title: "Vòng tay biên giới", slug: "vong-tay-bien-gioi", artwork: "/3288/catalogue/vong-tay-bien-gioi.jpg", status: "forming", route: null, position: { x: 42, y: 85 } },
  { title: "Hai Tháng Trời", slug: "hai-thang-troi", artwork: "/3288/catalogue/hai-thang-troi.jpg", status: "forming", route: null, position: { x: 59, y: 85 } },
  { title: "Mùa Thu Tìm Em", slug: "mua-thu-tim-em", artwork: "/3288/catalogue/mua-thu-tim-em.jpg", status: "forming", route: null, position: { x: 76, y: 85 } },
  { title: "Đêm Vắng", slug: "dem-vang", artwork: "/3288/catalogue/dem-vang.jpg", status: "forming", route: null, position: { x: 93, y: 85 } },
] as const satisfies readonly CatalogueSong[];
