import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

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
