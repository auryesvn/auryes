import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  finishSceneCrossfade,
  resolveSceneRequest,
  startSceneCrossfade,
} from "./scene-transition.ts";

const initial = {
  currentAsset: "frame-01-room-dance.png",
  outgoingAsset: null,
  phase: "idle",
};

test("current scene remains mounted while the incoming image is not ready", () => {
  const next = resolveSceneRequest(initial, {
    asset: "frame-02-bed-rose.png",
    desiredAsset: "frame-02-bed-rose.png",
    ready: false,
    reducedMotion: false,
  });
  assert.strictEqual(next, initial);
});

test("an older image request cannot overwrite the latest desired scene", () => {
  const next = resolveSceneRequest(initial, {
    asset: "frame-02-bed-rose.png",
    desiredAsset: "frame-03-eyes-reflection.png",
    ready: true,
    reducedMotion: false,
  });
  assert.strictEqual(next, initial);
});

test("ready scenes crossfade through independent outgoing and incoming layers", () => {
  const prepared = resolveSceneRequest(initial, {
    asset: "frame-02-bed-rose.png",
    desiredAsset: "frame-02-bed-rose.png",
    ready: true,
    reducedMotion: false,
  });
  assert.deepEqual(prepared, {
    currentAsset: "frame-02-bed-rose.png",
    outgoingAsset: "frame-01-room-dance.png",
    phase: "prepared",
  });
  assert.equal(startSceneCrossfade(prepared).phase, "crossfading");
  assert.deepEqual(finishSceneCrossfade(startSceneCrossfade(prepared)), {
    currentAsset: "frame-02-bed-rose.png",
    outgoingAsset: null,
    phase: "idle",
  });
});

test("reduced motion waits for readiness then swaps without animation", () => {
  const next = resolveSceneRequest(initial, {
    asset: "frame-02-bed-rose.png",
    desiredAsset: "frame-02-bed-rose.png",
    ready: true,
    reducedMotion: true,
  });
  assert.deepEqual(next, {
    currentAsset: "frame-02-bed-rose.png",
    outgoingAsset: null,
    phase: "idle",
  });
});

test("experience uses buffered layers rather than direct visual src replacement", async () => {
  const source = await readFile(
    new URL("./chon-binh-yen-experience.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /cby-scene-outgoing/);
  assert.match(source, /cby-scene-incoming/);
  assert.match(source, /cby-scene-pending/);
  assert.match(source, /image\.decode\(\)/);
  assert.doesNotMatch(source, /src=\{frameSrc\(visual\.asset\)\}/);
});