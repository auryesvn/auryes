export type DeliveryChannelResult =
  | { ok: true }
  | { ok: false; reason: string };

export type CoffeeSubmissionDelivery = {
  database: DeliveryChannelResult;
  telegram: DeliveryChannelResult;
};

export type CanonicalCoffeeSubmission<TAddressMode, TAnswers, TResult> = {
  submissionId: string;
  quizVersion: number;
  name: string;
  instagram: string | null;
  addressMode: TAddressMode;
  answers: TAnswers;
  result: TResult;
  submittedAt: Date;
};

type PreparationRules<TAddressMode, TAnswers, TResult> = {
  quizVersion: number;
  isAddressMode: (value: unknown) => value is TAddressMode;
  isCompleteAnswers: (value: unknown) => value is TAnswers;
  normalizeInstagram: (value: string) => string | null | undefined;
  computeResult: (answers: TAnswers) => TResult;
  createSubmissionId: () => string;
  now: () => Date;
};

type DeliveryChannel<TSubmission> = (
  submission: TSubmission,
  signal: AbortSignal,
) => Promise<void>;

type DeliveryOptions<TSubmission> = {
  database: DeliveryChannel<TSubmission>;
  telegram: DeliveryChannel<TSubmission>;
  databaseTimeoutMs: number;
  telegramTimeoutMs: number;
  logger?: (entry: DeliveryLogEntry) => void;
};

export type DeliveryLogEntry = {
  submissionId: string;
  channel: "database" | "telegram";
  ok: boolean;
  reason?: string;
  durationMs: number;
};

export class CoffeeDeliveryError extends Error {
  readonly reason: string;

  constructor(reason: string) {
    super(reason);
    this.name = "CoffeeDeliveryError";
    this.reason = reason;
  }
}

const REQUEST_KEYS = new Set([
  "quizVersion",
  "name",
  "instagram",
  "addressMode",
  "answers",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deliveryFailureReason(error: unknown) {
  if (error instanceof CoffeeDeliveryError) return error.reason;
  if (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  )
    return "timeout";
  if (error instanceof Error && error.message === "telegram_configuration")
    return "configuration";
  if (error instanceof Error && error.message === "telegram_response")
    return "provider_error";
  return "unexpected_error";
}

export function prepareCoffeeSubmission<TAddressMode, TAnswers, TResult>(
  body: unknown,
  rules: PreparationRules<TAddressMode, TAnswers, TResult>,
): CanonicalCoffeeSubmission<TAddressMode, TAnswers, TResult> | null {
  if (
    !isRecord(body) ||
    Object.keys(body).some((key) => !REQUEST_KEYS.has(key))
  )
    return null;

  const name =
    typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const instagram =
    typeof body.instagram === "string"
      ? rules.normalizeInstagram(body.instagram)
      : undefined;

  if (
    body.quizVersion !== rules.quizVersion ||
    !rules.isAddressMode(body.addressMode) ||
    !rules.isCompleteAnswers(body.answers) ||
    name.length < 1 ||
    name.length > 80 ||
    instagram === undefined
  )
    return null;

  try {
    return {
      submissionId: rules.createSubmissionId(),
      quizVersion: rules.quizVersion,
      name,
      instagram,
      addressMode: body.addressMode,
      answers: body.answers,
      result: rules.computeResult(body.answers),
      submittedAt: rules.now(),
    };
  } catch {
    return null;
  }
}

function createDeliveryTimeout(timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    const reason = new Error("Delivery timed out");
    reason.name = "TimeoutError";
    controller.abort(reason);
  }, timeoutMs);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

export async function deliverCoffeeSubmission<
  TSubmission extends { submissionId: string },
>(
  submission: TSubmission,
  options: DeliveryOptions<TSubmission>,
): Promise<CoffeeSubmissionDelivery> {
  const databaseStartedAt = Date.now();
  const telegramStartedAt = Date.now();
  const databaseTimeout = createDeliveryTimeout(options.databaseTimeoutMs);
  const telegramTimeout = createDeliveryTimeout(options.telegramTimeoutMs);
  const databasePromise = Promise.resolve()
    .then(() => options.database(submission, databaseTimeout.signal))
    .finally(databaseTimeout.clear);
  const telegramPromise = Promise.resolve()
    .then(() => options.telegram(submission, telegramTimeout.signal))
    .finally(telegramTimeout.clear);

  const [databaseSettled, telegramSettled] = await Promise.allSettled([
    databasePromise,
    telegramPromise,
  ]);
  const database: DeliveryChannelResult =
    databaseSettled.status === "fulfilled"
      ? { ok: true }
      : { ok: false, reason: deliveryFailureReason(databaseSettled.reason) };
  const telegram: DeliveryChannelResult =
    telegramSettled.status === "fulfilled"
      ? { ok: true }
      : { ok: false, reason: deliveryFailureReason(telegramSettled.reason) };

  options.logger?.({
    submissionId: submission.submissionId,
    channel: "database",
    ok: database.ok,
    ...(!database.ok && { reason: database.reason }),
    durationMs: Date.now() - databaseStartedAt,
  });
  options.logger?.({
    submissionId: submission.submissionId,
    channel: "telegram",
    ok: telegram.ok,
    ...(!telegram.ok && { reason: telegram.reason }),
    durationMs: Date.now() - telegramStartedAt,
  });

  return { database, telegram };
}

export function coffeeSubmissionWasDelivered(
  delivery: CoffeeSubmissionDelivery,
) {
  return delivery.database.ok || delivery.telegram.ok;
}

export function coffeeSubmissionResponse(delivery: CoffeeSubmissionDelivery) {
  return coffeeSubmissionWasDelivered(delivery)
    ? { status: 201, body: { ok: true } as const }
    : {
        status: 500,
        body: { error: "Unable to submit quiz" } as const,
      };
}
