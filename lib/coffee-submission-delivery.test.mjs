import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  CoffeeDeliveryError,
  coffeeSubmissionResponse,
  deliverCoffeeSubmission,
  prepareCoffeeSubmission,
} from "./coffee-submission-delivery.ts";

const submission = { submissionId: "submission-123" };
const succeeds = async () => {};
const fails = async () => {
  throw new CoffeeDeliveryError("provider_error");
};
const timesOut = async (_submission, signal) =>
  new Promise((_, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
  });

async function deliver(database, telegram) {
  return deliverCoffeeSubmission(submission, {
    database,
    telegram,
    databaseTimeoutMs: 10,
    telegramTimeoutMs: 10,
  });
}

for (const [name, database, telegram, expected] of [
  ["database success and Telegram success", succeeds, succeeds, 201],
  ["database failure and Telegram success", fails, succeeds, 201],
  ["database timeout and Telegram success", timesOut, succeeds, 201],
  ["database success and Telegram failure", succeeds, fails, 201],
  ["database failure and Telegram failure", fails, fails, 500],
  ["Telegram timeout and database success", succeeds, timesOut, 201],
]) {
  test(`${name} aggregates to ${expected}`, async () => {
    const result = await deliver(database, telegram);
    assert.equal(coffeeSubmissionResponse(result).status, expected);
  });
}

test("both delivery channels start independently", async () => {
  let releaseDatabase;
  const databaseGate = new Promise((resolve) => {
    releaseDatabase = resolve;
  });
  let databaseStarted = false;
  let telegramStarted = false;
  const resultPromise = deliverCoffeeSubmission(submission, {
    database: async () => {
      databaseStarted = true;
      await databaseGate;
    },
    telegram: async () => {
      telegramStarted = true;
      releaseDatabase();
    },
    databaseTimeoutMs: 100,
    telegramTimeoutMs: 100,
  });
  await Promise.resolve();
  assert.equal(databaseStarted, true);
  assert.equal(telegramStarted, true);
  assert.equal(coffeeSubmissionResponse(await resultPromise).status, 201);
});

const validBody = {
  quizVersion: 1,
  name: "  Kai   Trần ",
  instagram: "@kai",
  addressMode: "cau_minh",
  answers: { q: "A" },
};
const preparationRules = {
  quizVersion: 1,
  isAddressMode: (value) => value === "cau_minh",
  isCompleteAnswers: (value) => value?.q === "A",
  normalizeInstagram: (value) => value.replace(/^@/, "") || null,
  computeResult: () => ({ verdictKey: "promising", profileKeys: [] }),
  createSubmissionId: () => "submission-123",
  now: () => new Date("2026-08-27T00:00:00Z"),
};

test("validation failure prevents both channels", async () => {
  let calls = 0;
  const prepared = prepareCoffeeSubmission(
    { ...validBody, name: "" },
    preparationRules,
  );
  if (prepared)
    await deliverCoffeeSubmission(prepared, {
      database: async () => { calls += 1; },
      telegram: async () => { calls += 1; },
      databaseTimeoutMs: 10,
      telegramTimeoutMs: 10,
    });
  assert.equal(prepared, null);
  assert.equal(calls, 0);
});

test("recompute failure prevents both channels", async () => {
  let calls = 0;
  const prepared = prepareCoffeeSubmission(validBody, {
    ...preparationRules,
    computeResult: () => { throw new Error("recompute failed"); },
  });
  if (prepared)
    await deliverCoffeeSubmission(prepared, {
      database: async () => { calls += 1; },
      telegram: async () => { calls += 1; },
      databaseTimeoutMs: 10,
      telegramTimeoutMs: 10,
    });
  assert.equal(prepared, null);
  assert.equal(calls, 0);
});

test("canonical preparation normalizes data before fan-out", () => {
  const prepared = prepareCoffeeSubmission(validBody, preparationRules);
  assert.equal(prepared?.name, "Kai Trần");
  assert.equal(prepared?.instagram, "kai");
  assert.equal(prepared?.submissionId, "submission-123");
  assert.equal(prepared?.result.verdictKey, "promising");
});

test("response contract does not expose provider failures", async () => {
  const delivery = await deliver(fails, fails);
  const response = coffeeSubmissionResponse(delivery);
  assert.deepEqual(response, {
    status: 500,
    body: { error: "Unable to submit quiz" },
  });
  assert.equal(JSON.stringify(response).includes("provider_error"), false);
});

test("existing client parses response.ok and keeps its double-submit guard", () => {
  const source = readFileSync(
    "app/game/coffee/_components/coffee-quiz.tsx",
    "utf8",
  );
  assert.equal(source.includes('setSendState(response.ok ? "sent" : "failed")'), true);
  assert.equal(source.includes("submissionInFlightRef.current ||"), true);
  assert.equal(source.includes("submissionInFlightRef.current = true"), true);
  assert.equal(source.includes("submissionInFlightRef.current = false"), true);
});
