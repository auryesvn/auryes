import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  audioTimelineProgress,
  clampAudioTime,
  displayedAudioTime,
} from "./audio-timeline.ts";

const componentSource = () =>
  readFile(new URL("./tinh-ma-experience.tsx", import.meta.url), "utf8");
const cssSource = () => readFile(new URL("../../3288.css", import.meta.url), "utf8");

test("timeline values clamp to a finite media duration", () => {
  assert.equal(clampAudioTime(75, 300), 75);
  assert.equal(clampAudioTime(-20, 300), 0);
  assert.equal(clampAudioTime(400, 300), 300);
  assert.equal(clampAudioTime(Number.NaN, 300), null);
  assert.equal(clampAudioTime(20, 0), null);
  assert.equal(clampAudioTime(20, Number.POSITIVE_INFINITY), null);
});

test("scrub preview overrides media time only while present", () => {
  assert.equal(displayedAudioTime(40, null), 40);
  assert.equal(displayedAudioTime(40, 125.5), 125.5);
});

test("timeline progress stays within zero and one hundred percent", () => {
  assert.equal(audioTimelineProgress(75, 300), 25);
  assert.equal(audioTimelineProgress(-1, 300), 0);
  assert.equal(audioTimelineProgress(400, 300), 100);
  assert.equal(audioTimelineProgress(20, 0), 0);
});

test("player uses a native range with continuous seek and invalid-duration disabling", async () => {
  const source = await componentSource();
  assert.match(source, /<input\s+className="timeline"\s+type="range"/s);
  assert.match(source, /max=\{hasDuration \? timelineDuration : 0\}/);
  assert.match(source, /step="0\.01"/);
  assert.match(source, /value=\{hasDuration \? displayedTime : 0\}/);
  assert.match(source, /disabled=\{!isTinhMa \|\| !hasDuration\}/);
  assert.match(source, /aria-label="Tua bài hát"/);
  assert.match(source, /onChange=\{\(event\) => seekFromRange\(event\.currentTarget\.value\)\}/);
  assert.match(source, /setScrubTime\(nextTime\);\s+seek\(nextTime\)/s);
});

test("native range removes custom pointer capture and duplicate slider semantics", async () => {
  const source = await componentSource();
  assert.doesNotMatch(source, /role="slider"/);
  assert.doesNotMatch(source, /setPointerCapture|releasePointerCapture|activePointerRef|onPointerMove/);
  assert.doesNotMatch(source, /<div\s+className="timeline"/);
  assert.match(source, /onTouchEnd=\{finishScrubbing\}/);
  assert.match(source, /onTouchCancel=\{finishScrubbing\}/);
});

test("scrubbing does not play or pause media", async () => {
  const source = await componentSource();
  const player = source.slice(source.indexOf("function Player("));
  assert.doesNotMatch(player, /\.play\(\)|\.pause\(\)|startPlayback\(/);
});

test("native range has WebKit and Firefox tracks plus a 36px mobile hit area", async () => {
  const css = await cssSource();
  assert.match(css, /input\.timeline::-webkit-slider-runnable-track/);
  assert.match(css, /input\.timeline::-webkit-slider-thumb/);
  assert.match(css, /input\.timeline::-moz-range-track/);
  assert.match(css, /input\.timeline::-moz-range-progress/);
  assert.match(css, /--progress:0%/);
  assert.match(css, /\.player\.compact \.timeline\{grid-area:timeline;[^}]*height:36px;margin-top:8px/);
  assert.doesNotMatch(css, /\.timeline\{[^}]*touch-action:none/);
});

test("compact mobile card matches the 126px source-level height budget", async () => {
  const css = await cssSource();
  assert.match(css, /grid-template-columns:56px minmax\(0,1fr\) 56px/);
  assert.match(css, /padding:12px 13px/);
  assert.match(css, /\.player\.compact \.player-art\{grid-area:artwork;width:56px;height:56px\}/);
  assert.match(css, /\.player\.compact \.player-play\{grid-area:control;width:56px;height:56px/);
  assert.doesNotMatch(css, /\.player\.compact\{[^}]*min-height:/);
  assert.match(css, /--tm-player-height:126px/);
  assert.match(css, /--tm-player-reserved-space:calc\(var\(--tm-player-height\) \+ var\(--tm-player-bottom\) \+ var\(--tm-player-gap\)\)/);
  assert.match(css, /\.tm-panel\{bottom:var\(--tm-player-reserved-space\)\}/);
  assert.match(css, /body:has\(\[data-context-return-bar\]\).*\.tm-panel\{bottom:calc\(var\(--tm-player-reserved-space\) \+ var\(--context-return-offset\)\)\}/s);
  assert.equal(12 + 56 + 8 + 36 + 12 + 2, 126);
});

test("host-aware source, canonical artwork, and native playback lifecycle remain intact", async () => {
  const source = await componentSource();
  assert.match(source, /const audioSrc = `\$\{basePath\}\/tinh-ma\/tinh-ma\.mp3`/);
  assert.match(source, /preload="auto"/);
  assert.match(source, /onTimeUpdate=\{\(event\) => setTime/);
  assert.match(source, /className="player-art"><Image src="\/3288\/tinh-ma\/tinh-ma-artwork\.png" alt="" fill sizes="56px"/);
  assert.match(source, /function AudioControlIcon/);
  assert.match(source, /aria-hidden="true" className=\{`audio-control-icon/);
  assert.doesNotMatch(source, /Ⅱ|▶/);
});
