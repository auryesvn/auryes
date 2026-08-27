import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const faviconUrl = "/3288-fav.ico?v=1";

test("3288 favicon is the supplied single-frame 128px ICO", async () => {
  const icon = await readFile(new URL("../../public/3288-fav.ico", import.meta.url));
  assert.equal(icon.readUInt16LE(0), 0);
  assert.equal(icon.readUInt16LE(2), 1);
  assert.equal(icon.readUInt16LE(4), 1);
  assert.equal(icon[6], 128);
  assert.equal(icon[7], 128);
  assert.equal(icon.readUInt16LE(12), 32);
});

test("3288 layout owns a cache-busted segment favicon", async () => {
  const layout = await readFile(new URL("./layout.tsx", import.meta.url), "utf8");
  assert.match(layout, new RegExp(faviconUrl.replace(/[.?]/g, "\\$&"), "g"));
  assert.match(layout, /type: "image\/x-icon"/);
  assert.match(layout, /sizes: "128x128"/);
  assert.doesNotMatch(layout, /\/3288\/3288-fav\.ico/);
});

test("root metadata stays independent from the 3288 favicon", async () => {
  const rootLayout = await readFile(new URL("../layout.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(rootLayout, /3288-fav\.ico/);
  await readFile(new URL("../favicon.ico", import.meta.url));
});

test("3288 hostname rewrite lets the public favicon resolve directly", async () => {
  const config = await readFile(new URL("../../next.config.ts", import.meta.url), "utf8");
  assert.ok(config.includes("3288-fav\\\\.ico$"));
  assert.doesNotMatch(config, /destination: "\/3288\/3288-fav\.ico"/);
});
