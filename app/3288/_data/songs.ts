export const universeNodes = [
  { id: "forest", title: "NHỮNG KHU RỪNG MƠ", x: 17, y: 24, tone: "forest" },
  { id: "tinhma", title: "TÌNH MA", x: 45, y: 19, tone: "tinhma", href: "/3288/tinh-ma" },
  { id: "city", title: "ĐÈN SAU 3 GIỜ", x: 79, y: 28, tone: "city" },
  { id: "hills", title: "QUA NHỮNG NGỌN ĐỒI", x: 52, y: 58, tone: "hills" },
  { id: "return", title: "ĐI ĐỂ TRỞ VỀ", x: 22, y: 70, tone: "return" },
  { id: "together", title: "CÙNG NHAU", x: 83, y: 69, tone: "together" },
] as const;

export type UniverseNode = (typeof universeNodes)[number];
