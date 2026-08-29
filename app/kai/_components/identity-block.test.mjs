import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { initialIdentityState, reduceIdentityState } from "./identity-state.mjs";

const component = await readFile(new URL("./identity-block.tsx", import.meta.url), "utf8");
const data = await readFile(new URL("../_data/identities.ts", import.meta.url), "utf8");
const page = await readFile(new URL("../page.tsx", import.meta.url), "utf8");

test("outer accordion starts closed and resets all nested state when closed", () => {
  assert.deepEqual(initialIdentityState, { rolesOpen: false, selectedIdentity: null, whyOpen: false });
  const opened = reduceIdentityState(initialIdentityState, { type: "toggle-roles" });
  const selected = reduceIdentityState(opened, { type: "toggle-identity", identityId: "seller" });
  assert.deepEqual(reduceIdentityState(selected, { type: "toggle-roles" }), initialIdentityState);
});

test("identity selection is exclusive, toggles closed, and closes why", () => {
  const why = reduceIdentityState({ rolesOpen: true, selectedIdentity: null, whyOpen: false }, { type: "open-why" });
  const seller = reduceIdentityState(why, { type: "toggle-identity", identityId: "seller" });
  assert.deepEqual(seller, { rolesOpen: true, selectedIdentity: "seller", whyOpen: false });
  const founder = reduceIdentityState(seller, { type: "toggle-identity", identityId: "founder" });
  assert.equal(founder.selectedIdentity, "founder");
  assert.equal(reduceIdentityState(founder, { type: "toggle-identity", identityId: "founder" }).selectedIdentity, null);
});

test("canonical explanation clears selected identity", () => {
  const state = reduceIdentityState({ rolesOpen: true, selectedIdentity: "musician", whyOpen: false }, { type: "open-why" });
  assert.deepEqual(state, { rolesOpen: true, selectedIdentity: null, whyOpen: true });
});

test("component renders six configured buttons with semantic accordion and pressed state", () => {
  assert.equal((data.match(/id: "/g) ?? []).length, 6);
  assert.match(component, /aria-expanded=\{state\.rolesOpen\}/);
  assert.match(component, /aria-controls="kai-identities-content"/);
  assert.match(component, /aria-pressed=\{active\}/);
  assert.match(component, /kaiIdentities\.map/);
  assert.doesNotMatch(component, /selectedIdentity\s*===\s*"seller"/);
});

test("identity CTAs reuse canonical project data and existing project/contact markup remains", () => {
  assert.match(data, /href: kaiProfile\.projects\.mbmc/);
  assert.match(data, /href: kaiProfile\.projects\.auryes/);
  assert.match(data, /href: kaiProfile\.projects\.project3288/);
  assert.match(page, /href=\{kaiProfile\.projects\.mbmc\}/);
  assert.match(page, /href=\{kaiProfile\.projects\.auryes\}/);
  assert.match(page, /href=\{kaiProfile\.projects\.project3288\}/);
  assert.match(page, /contactLinks\.map/);
});
