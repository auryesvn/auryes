import assert from "node:assert/strict";
import test from "node:test";

import {
  CHON_BINH_YEN_DURATION,
  activeChapterAt,
  activeCueAt,
  activeVisualStateAt,
  chonBinhYenChapters,
  chonBinhYenCues,
  chonBinhYenVisualStates,
} from "./chon-binh-yen-cues.ts";

test("lyric and visual cues are chronological", () => {
  assert.deepEqual([...chonBinhYenCues].sort((a, b) => a.at - b.at), chonBinhYenCues);
  assert.deepEqual([...chonBinhYenVisualStates].sort((a, b) => a.at - b.at), chonBinhYenVisualStates);
});

test("verified master duration preserves the full instrumental coda", () => {
  assert.equal(CHON_BINH_YEN_DURATION, 273.789);
  assert.equal(chonBinhYenCues.at(-1)?.at, 249);
  assert.ok(CHON_BINH_YEN_DURATION - chonBinhYenCues.at(-1).at > 24);
});

test("selectors change on exact editorial boundaries", () => {
  assert.equal(activeCueAt(33.99).cue, null);
  assert.equal(activeCueAt(34).cue?.line, chonBinhYenCues[0].line);
  assert.equal(activeVisualStateAt(165.99).id, "relapse");
  assert.equal(activeVisualStateAt(166).id, "dawn");
  assert.equal(activeVisualStateAt(CHON_BINH_YEN_DURATION).id, "star");
});
test("eight narrative chapters map onto canonical visual cue boundaries", () => {
  assert.equal(chonBinhYenVisualStates.length, 12);
  assert.deepEqual(
    chonBinhYenChapters.map(({ at, label }) => [at, label]),
    [
      [0, "Căn phòng"],
      [34, "Đóa hồng"],
      [50, "Nhật ký"],
      [85, "Mặt đất"],
      [116, "Vệt cánh"],
      [166, "Bình minh"],
      [231, "Rời mặt đất"],
      [249, "Ngủ ngoan"],
    ],
  );
  assert.equal(activeChapterAt(49.99).label, "Đóa hồng");
  assert.equal(activeChapterAt(198.3).label, "Bình minh");
  assert.equal(activeChapterAt(238.3).label, "Rời mặt đất");
  assert.equal(activeChapterAt(CHON_BINH_YEN_DURATION).label, "Ngủ ngoan");
});
