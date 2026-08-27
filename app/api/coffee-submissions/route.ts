import { NextResponse } from "next/server";

import {
  CoffeeDeliveryError,
  coffeeSubmissionResponse,
  deliverCoffeeSubmission,
  prepareCoffeeSubmission,
  type DeliveryLogEntry,
} from "@/lib/coffee-submission-delivery";
import {
  COFFEE_QUIZ_VERSION,
  computeCoffeeResult,
  isAddressMode,
  isCompleteAnswers,
  normalizeInstagram,
} from "@/lib/coffee-quiz";
import { getServerSupabase } from "@/lib/supabase-server";
import { sendCoffeeSubmissionNotification } from "@/lib/telegram";

const MAX_REQUEST_BYTES = 4_096;
const DATABASE_TIMEOUT_MS = 7_000;
const TELEGRAM_TIMEOUT_MS = 5_000;

function invalidRequest() {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

function logDelivery(entry: DeliveryLogEntry) {
  const method = entry.ok ? console.info : console.warn;
  method("[coffee] submission delivery", entry);
}

export async function POST(request: Request) {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return invalidRequest();

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_REQUEST_BYTES
  )
    return invalidRequest();

  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_REQUEST_BYTES)
      return invalidRequest();
    body = JSON.parse(raw);
  } catch {
    return invalidRequest();
  }

  const submission = prepareCoffeeSubmission(body, {
    quizVersion: COFFEE_QUIZ_VERSION,
    isAddressMode,
    isCompleteAnswers,
    normalizeInstagram,
    computeResult: computeCoffeeResult,
    createSubmissionId: crypto.randomUUID,
    now: () => new Date(),
  });
  if (!submission) return invalidRequest();

  const delivery = await deliverCoffeeSubmission(submission, {
    databaseTimeoutMs: DATABASE_TIMEOUT_MS,
    telegramTimeoutMs: TELEGRAM_TIMEOUT_MS,
    logger: logDelivery,
    database: async (canonical, signal) => {
      const { error } = await getServerSupabase()
        .from("coffee_quiz_submissions")
        .insert({
          id: canonical.submissionId,
          quiz_version: canonical.quizVersion,
          name: canonical.name,
          instagram_handle: canonical.instagram,
          address_mode: canonical.addressMode,
          answers: canonical.answers,
          verdict_key: canonical.result.verdictKey,
          profile_snapshot: { keys: canonical.result.profileKeys },
        })
        .abortSignal(signal);
      if (error) throw new CoffeeDeliveryError("provider_error");
    },
    telegram: (canonical, signal) =>
      sendCoffeeSubmissionNotification(canonical, signal),
  });
  const response = coffeeSubmissionResponse(delivery);
  return NextResponse.json(response.body, { status: response.status });
}
