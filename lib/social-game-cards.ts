export const SOCIAL_GAME_CARDS = [
  { id: 1, title: "FIRST IMPRESSION" },
  { id: 2, title: "ĐỌC TÔI ĐI" },
  { id: 3, title: "SAI Ở ĐÂU?" },
  { id: 4, title: "AI KHÓ ĐỌC NHẤT?" },
  { id: 5, title: "ĐỔI VAI" },
  { id: 6, title: "CHỌN MỘT NGƯỜI" },
  { id: 7, title: "HỎI NGƯỢC" },
  { id: 8, title: "60 GIÂY" },
  { id: 9, title: "MATCHMAKER" },
  { id: 10, title: "PROJECTION" },
  { id: 11, title: "INSTAGRAM ≠ REALITY" },
  { id: 12, title: "PLOT TWIST" },
  { id: 13, title: "THREE WORDS" },
  { id: 14, title: "CHUYỀN QUYỀN" },
  { id: 15, title: "HUMAN CARD" },
  { id: 16, title: "DOUBLE DRAW" },
  { id: 17, title: "ĐOÁN TRƯỚC" },
  { id: 18, title: "AI SẼ HỢP VỚI TÔI?" },
  { id: 19, title: "ĐỔI FIRST IMPRESSION" },
  { id: 20, title: "CÂU CHƯA HỎI" },
  { id: 21, title: "ANONYMOUS PROBE" },
  { id: 22, title: "CHAIN REACTION" },
  { id: 23, title: "ROOM VOTE" },
  { id: 24, title: "SECRET TARGET" },
  { id: 25, title: "CALLBACK" },
  { id: 26, title: "PRIVATE NOTE" },
  { id: 27, title: "CREATE" },
  { id: 28, title: "FORK" },
  { id: 29, title: "PATCH NOTE" },
  { id: 30, title: "WILDCARD: PHÁ LUẬT" },
  { id: 31, title: "AFTER CREDIT" },
] as const;

export type SocialGameCardId = (typeof SOCIAL_GAME_CARDS)[number]["id"];

export function isSocialGameCardId(value: unknown): value is SocialGameCardId {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    SOCIAL_GAME_CARDS.some((card) => card.id === value)
  );
}
