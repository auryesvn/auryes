import assert from "node:assert/strict";
import test from "node:test";

import {
  CHON_BINH_YEN_DURATION,
  activeCueAt,
  activeVisualStateAt,
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
