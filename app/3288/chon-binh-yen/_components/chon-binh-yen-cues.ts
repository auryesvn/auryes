export const CHON_BINH_YEN_DURATION = 273.789;

export const chonBinhYenCues = [
  { at: 34, section: "verse", line: "Em xinh như đóa hồng giữa cánh đồng rộng lớn," },
  { at: 42, section: "verse", line: "mắt em buồn chứa chan một bầu trời thương nhớ" },
  { at: 50, section: "verse", line: "Em giấu những giọt lệ nghẹn ngào sau mỗi dòng nhật ký" },
  { at: 58, section: "verse", line: "để gió mang lời thầm thì sẽ đưa em về chốn bình yên" },
  { at: 85, section: "pre-chorus-1", line: "Em không mong đợi gì vào tương lai" },
  { at: 92.3, section: "pre-chorus-1", line: "Em không mong đợi gì vào một ai" },
  { at: 100.3, section: "pre-chorus-1", line: "Em không mong một lần được nắm tay anh đến cuối cuộc đời" },
  { at: 108, section: "pre-chorus-1", line: "Em chỉ ước nhìn thấy tia nắng vào ngày mai" },
  { at: 116, section: "chorus-1", line: "Muôn hoa cất lời, vạn vật xoay theo khúc nhạc buồn" },
  { at: 124, section: "chorus-1", line: "giấc mơ đẹp đưa em khuất xa dần nơi tăm tối" },
  { at: 132, section: "chorus-1", line: "Ngôi sao sáng ngời, tỏa sáng lung linh giữa trời," },
  { at: 140.3, section: "chorus-1", line: "và mang theo một kiếp người, bay về chốn bình yên" },
  { at: 166, section: "bridge", line: "Một nơi ánh dương chiếu sáng ngời," },
  { at: 170, section: "bridge", line: "một nơi bao la những tiếng cười" },
  { at: 174, section: "bridge", line: "Để lại hết những đớn đau... trong đời bay theo gió" },
  { at: 182, section: "bridge", line: "Em đi rồi, mây buồn còn nhớ đất thương" },
  { at: 190.3, section: "bridge", line: "Chúc em yên bình nơi chốn bình yên" },
  { at: 198.3, section: "pre-chorus-2", line: "Em không mong đợi gì vào tương lai" },
  { at: 206.3, section: "pre-chorus-2", line: "Em không mong đợi gì vào một ai" },
  { at: 214.3, section: "pre-chorus-2", line: "Em không mong một lần được nắm tay anh đến cuối cuộc đời" },
  { at: 222.3, section: "pre-chorus-2", line: "Em chỉ ước nhìn thấy tia nắng vào ngày mai" },
  { at: 231, section: "final-chorus", line: "Ngôi sao sáng ngời, tỏa sáng lung linh giữa trời," },
  { at: 238.3, section: "final-chorus", line: "và mang theo một kiếp người, bay về chốn bình yên" },
  { at: 249, section: "end", line: "Khép đôi mi, ngủ ngoan nhé em." },
] as const;

export const chonBinhYenVisualStates = [
  { at: 0, id: "room", chapter: "I — CĂN PHÒNG", asset: "frame-01-room-dance.png" },
  { at: 34, id: "rose", chapter: "II — ĐÓA HỒNG", asset: "frame-02-bed-rose.png" },
  { at: 42, id: "eyes", chapter: "III — BẦU TRỜI TRONG MẮT", asset: "frame-03-eyes-reflection.png" },
  { at: 50, id: "field", chapter: "IV — CÁNH ĐỒNG", asset: "frame-04-field-diary.png" },
  { at: 85, id: "grounded", chapter: "V — MẶT ĐẤT", asset: "frame-05-grounded-dance.png" },
  { at: 116, id: "trace", chapter: "VI — VỆT CÁNH", asset: "frame-06-wing-trace.png" },
  { at: 148, id: "relapse", chapter: "VII — TRỌNG LỰC", asset: "frame-07-relapse.png" },
  { at: 166, id: "dawn", chapter: "VIII — BÌNH MINH", asset: "frame-08-dawn-release.png" },
  { at: 198.3, id: "final-dance", chapter: "IX — ĐIỆU NHẢY CUỐI", asset: "frame-09-final-dance.png" },
  { at: 231, id: "lift", chapter: "X — RỜI MẶT ĐẤT", asset: "frame-10-first-lift.png" },
  { at: 238.3, id: "ascent", chapter: "XI — BAY LÊN", asset: "frame-11-ascent.png" },
  { at: 249, id: "star", chapter: "XII — NGỦ NGOAN", asset: "frame-12-single-star.png" },
] as const;

export const chonBinhYenChapters = [
  { at: 0, id: "room", label: "Căn phòng" },
  { at: 34, id: "rose", label: "Đóa hồng" },
  { at: 50, id: "journal", label: "Nhật ký" },
  { at: 85, id: "grounded", label: "Mặt đất" },
  { at: 116, id: "trace", label: "Vệt cánh" },
  { at: 166, id: "dawn", label: "Bình minh" },
  { at: 231, id: "lift", label: "Rời mặt đất" },
  { at: 249, id: "star", label: "Ngủ ngoan" },
] as const;

export function activeChapterAt(time: number) {
  let chapter: (typeof chonBinhYenChapters)[number] = chonBinhYenChapters[0];
  for (const candidate of chonBinhYenChapters) {
    if (time >= candidate.at) chapter = candidate;
  }
  return chapter;
}
export function activeCueAt(time: number) {
  let index = -1;
  for (let cursor = 0; cursor < chonBinhYenCues.length; cursor += 1) {
    if (time >= chonBinhYenCues[cursor].at) index = cursor;
  }
  return { index, cue: index >= 0 ? chonBinhYenCues[index] : null };
}

export function activeVisualStateAt(time: number) {
  let state: (typeof chonBinhYenVisualStates)[number] = chonBinhYenVisualStates[0];
  for (const candidate of chonBinhYenVisualStates) {
    if (time >= candidate.at) state = candidate;
  }
  return state;
}
