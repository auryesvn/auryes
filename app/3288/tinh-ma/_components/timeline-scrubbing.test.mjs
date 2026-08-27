import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  clampTimelineTime,
  timelineTimeFromKey,
  timelineTimeFromPointer,
} from "./timeline-scrubbing.ts";

test("pointer position maps to timeline time and clamps outside bounds", () => {
  assert.equal(timelineTimeFromPointer(150, 100, 200, 300), 75);
  assert.equal(timelineTimeFromPointer(20, 100, 200, 300), 0);
  assert.equal(timelineTimeFromPointer(400, 100, 200, 300), 300);
});

test("invalid duration or geometry disables pointer seeking", () => {
  assert.equal(timelineTimeFromPointer(100, 0, 0, 300), null);
  assert.equal(timelineTimeFromPointer(100, 0, 100, 0), null);
  assert.equal(clampTimelineTime(Number.NaN, 300), null);
});

test("keyboard timeline commands seek five seconds or to endpoints", () => {
  assert.equal(timelineTimeFromKey("ArrowLeft", 3, 300), 0);
  assert.equal(timelineTimeFromKey("ArrowRight", 298, 300), 300);
  assert.equal(timelineTimeFromKey("Home", 120, 300), 0);
  assert.equal(timelineTimeFromKey("End", 120, 300), 300);
  assert.equal(timelineTimeFromKey("Enter", 120, 300), null);
});

test("player keeps one captured pointer, preview state, and commit-on-release", async () => {
  const source = await readFile(
    new URL("./tinh-ma-experience.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /activePointerRef\.current !== null/);
  assert.match(source, /setPointerCapture\(event\.pointerId\)/);
  assert.match(source, /activePointerRef\.current === event\.pointerId/);
  assert.match(source, /onPointerUp=\{\(event\) => finishScrubbing\(event, true\)\}/);
  assert.match(source, /onPointerCancel=\{\(event\) => finishScrubbing\(event, false\)\}/);
  assert.match(source, /const displayedTime = scrubTime \?\? time/);
  assert.doesNotMatch(source, /<div\s+className="timeline"[^>]*onClick=/s);
  assert.doesNotMatch(source, /onMouse(?:Down|Move|Up)|onTouch(?:Start|Move|End)/);
});

test("pointer release recalculates the final position and commits once", async () => {
  const source = await readFile(new URL("./tinh-ma-experience.tsx", import.meta.url), "utf8");
  const start = source.indexOf("const finishScrubbing");
  const finish = source.slice(start, source.indexOf("return <footer", start));
  assert.match(finish, /previewPointerTime\(event\) \?\? scrubTimeRef\.current/);
  assert.equal(finish.match(/seek\(nextTime\)/g)?.length, 1);
  assert.match(finish, /hasPointerCapture\(event\.pointerId\)/);
});

test("cancel, lost capture, and foreign pointers only clean up their own gesture", async () => {
  const source = await readFile(new URL("./tinh-ma-experience.tsx", import.meta.url), "utf8");
  assert.match(source, /onPointerCancel=\{\(event\) => finishScrubbing\(event, false\)\}/);
  assert.match(source, /if \(activePointerRef\.current !== event\.pointerId\) return/);
  assert.match(source, /onLostPointerCapture=.*activePointerRef\.current !== event\.pointerId/s);
  assert.match(source, /onPointerMove=.*activePointerRef\.current === event\.pointerId/s);
});

test("timeline uses neutral slider semantics without native button activation", async () => {
  const source = await readFile(new URL("./tinh-ma-experience.tsx", import.meta.url), "utf8");
  assert.match(source, /<div\s+className="timeline"\s+role="slider"/);
  assert.match(source, /tabIndex=\{isTinhMa && hasDuration \? 0 : -1\}/);
  assert.match(source, /aria-disabled=\{!isTinhMa \|\| !hasDuration\}/);
  assert.doesNotMatch(source, /<button\s+className="timeline"/);
});

test("scrubbing never changes play or pause state", async () => {
  const source = await readFile(new URL("./tinh-ma-experience.tsx", import.meta.url), "utf8");
  const player = source.slice(source.indexOf("function Player("));
  assert.doesNotMatch(player, /\.play\(\)|\.pause\(\)|startPlayback\(/);
});

test("mobile timeline has an isolated touch gesture and full-width hit area", async () => {
  const css = await readFile(new URL("../../3288.css", import.meta.url), "utf8");
  assert.match(css, /\.timeline\{border:0;padding:0;cursor:pointer;touch-action:none\}/);
  assert.match(css, /\.player\.compact \.timeline\{[^}]*width:100%;height:36px/);
  assert.match(css, /\.timeline (?:i|b)\{[^}]*pointer-events:none/);
});
test("host-aware source and native playback lifecycle remain intact", async () => {
  const source = await readFile(
    new URL("./tinh-ma-experience.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /const audioSrc = `\$\{basePath\}\/tinh-ma\/tinh-ma\.mp3`/);
  assert.match(source, /preload="auto"/);
  assert.match(source, /onTimeUpdate=\{\(event\) => setTime/);
  assert.match(source, /onWaiting=/);
  assert.match(source, /onError=/);
});
