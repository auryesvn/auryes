import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./chon-binh-yen-experience.tsx", import.meta.url), "utf8");

test("player uses host-aware native streaming controls", () => {
  assert.match(source, /src=\{`\$\{basePath\}\/chon-binh-yen\/chon-binh-yen\.mp3`\}/);
  assert.match(source, /preload="auto"/);
  assert.match(source, /type="range"/);
  assert.doesNotMatch(source, /setPointerCapture|releasePointerCapture/);
});

test("world uses all twelve approved visual states", () => {
  assert.match(source, /chonBinhYenVisualStates\.map/);
  assert.match(source, /activeVisualStateAt\(time\)/);
  assert.match(source, /activeCueAt\(time\)/);
});
