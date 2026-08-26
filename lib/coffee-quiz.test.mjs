import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { readFileSync } from "node:fs";

import {
  ANSWER_IDS,
  COFFEE_QUESTIONS,
  computeCoffeeResult,
} from "./coffee-quiz.ts";

const questionIds = [
  "tired",
  "free_evening",
  "idea_reality",
  "jealousy_boundary",
  "small_promise",
  "separate_lives",
  "initiative",
  "partner_better_domain",
  "conflict_vulnerability",
  "outside_opinion",
  "busy_partner",
  "long_term_interest",
];

const baseAnswers = {
  tired: "B",
  free_evening: "A",
  idea_reality: "A",
  jealousy_boundary: "A",
  small_promise: "A",
  separate_lives: "A",
  initiative: "A",
  partner_better_domain: "A",
  conflict_vulnerability: "A",
  outside_opinion: "A",
  busy_partner: "D",
  long_term_interest: "A",
};

test("Coffee question order and answer contract remain canonical", () => {
  assert.deepEqual(
    COFFEE_QUESTIONS.map(({ id }) => id),
    questionIds,
  );
  for (const question of COFFEE_QUESTIONS) {
    assert.deepEqual(Object.keys(question.answers), ANSWER_IDS);
  }
  const contractHash = createHash("sha256")
    .update(JSON.stringify(COFFEE_QUESTIONS))
    .digest("hex");
  assert.equal(
    contractHash,
    "6d2a79c92aee8c258b2dc9430b4f8f04cee2368292b36ce0f3a2fdcfa4567904",
  );
});

test("Coffee verdict mapping remains unchanged for representative profiles", () => {
  assert.equal(computeCoffeeResult(baseAnswers).verdictKey, "promising");
  assert.equal(
    computeCoffeeResult({
      ...baseAnswers,
      tired: "A",
      free_evening: "D",
      separate_lives: "C",
      busy_partner: "A",
    }).verdictKey,
    "friend_like",
  );
  assert.equal(
    computeCoffeeResult({
      ...baseAnswers,
      tired: "D",
      free_evening: "D",
      jealousy_boundary: "D",
      small_promise: "D",
      separate_lives: "D",
      initiative: "D",
      conflict_vulnerability: "D",
      outside_opinion: "D",
      busy_partner: "D",
      long_term_interest: "D",
    }).verdictKey,
    "uncertain",
  );
  assert.equal(
    computeCoffeeResult({ ...baseAnswers, conflict_vulnerability: "C" })
      .verdictKey,
    "different_system",
  );
});

const resultModel =
  await import("../app/game/coffee/_components/coffee-result-model.ts");

const profileInsight = (key) => ({
  key: `profile:${key}`,
  heading: `Heading ${key}`,
  body: `Body ${key}`,
});

test("Coffee result seal mapping covers every verdict", () => {
  assert.deepEqual(resultModel.RESULT_SEAL_LABELS, {
    uncertain: "CHƯA KẾT LUẬN VỘI",
    promising: "ĐÁNG ĐỂ GẶP THỬ",
    friend_like: "HỢP LÀM ĐỒNG BỌN",
    different_system: "KHÁC HỆ MỘT CHÚT",
  });
});

test("Coffee insight presentation preserves content and supports 1–5 items", () => {
  for (let count = 1; count <= 5; count += 1) {
    const input = Array.from({ length: count }, (_, index) =>
      profileInsight(index),
    );
    const presented = resultModel.buildCoffeeInsightPresentation(null, input);
    assert.equal(presented.length, count);
    assert.deepEqual(
      presented.map(({ key, heading, body }) => ({ key, heading, body })),
      input,
    );
    assert.equal(presented[0].variant, "featured");
  }
});

test("Coffee verdict support remains first without reordering profiles", () => {
  const support = {
    key: "support:friend_like",
    heading: "Support",
    body: "Why",
  };
  const profiles = [profileInsight("limits"), profileInsight("presence")];
  const presented = resultModel.buildCoffeeInsightPresentation(
    support,
    profiles,
  );
  assert.deepEqual(
    presented.map(({ key }) => key),
    ["support:friend_like", "profile:limits", "profile:presence"],
  );
  assert.equal(presented[0].variant, "featured");
});

test("Coffee Reality Check eligibility remains tied to limits and A/B/D", () => {
  for (const answer of ["A", "B", "D"])
    assert.equal(
      resultModel.isCoffeeRealityCheckEligible("limits", answer),
      true,
    );
  assert.equal(resultModel.isCoffeeRealityCheckEligible("limits", "C"), false);
  assert.equal(
    resultModel.isCoffeeRealityCheckEligible("presence", "A"),
    false,
  );
});

test("Coffee result actions and submission lock retain their contracts", () => {
  assert.equal(
    resultModel.COFFEE_RECIPROCITY_URL,
    "https://auryes.vn/kai?context=coffee",
  );
  assert.equal(resultModel.coffeeSubmissionIsLocked("sending"), true);
  for (const state of ["idle", "sent", "failed"])
    assert.equal(resultModel.coffeeSubmissionIsLocked(state), false);
  assert.deepEqual(resultModel.COFFEE_INITIAL_UI_STATE, {
    stage: "intro",
    addressMode: null,
    questionIndex: 0,
    answers: {},
    name: "",
    instagram: "",
    formError: "",
    sendState: "idle",
  });
  const resultSource = readFileSync(
    "app/game/coffee/_components/coffee-result-screen.tsx",
    "utf8",
  );
  assert.equal(resultSource.includes("Xem thẻ của Kai"), false);
});
