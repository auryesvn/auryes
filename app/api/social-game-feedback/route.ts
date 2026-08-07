import { NextResponse } from "next/server";

import { getServerSupabase } from "@/lib/supabase-server";
import { isSocialGameCardId } from "@/lib/social-game-cards";

const MAX_REQUEST_BYTES = 4_096;
const MAX_IDENTIFIER_LENGTH = 64;
const MAX_MOMENT_LENGTH = 800;
const MAX_CARD_REASON_LENGTH = 500;
const MAX_INSTAGRAM_LENGTH = 30;
const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const INSTAGRAM_PATTERN = /^[A-Za-z0-9._]+$/;
const REQUEST_KEYS = new Set([
  "boxCode",
  "eventCode",
  "rating",
  "favoriteCardId",
  "favoriteCardReason",
  "memorableMoment",
  "playAgain",
  "instagramHandle",
  "reconnectConsent",
]);

type JsonRecord = Record<string, unknown>;

function invalidRequest() {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseIdentifier(value: unknown) {
  if (typeof value !== "string" || value.length > MAX_IDENTIFIER_LENGTH) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 && IDENTIFIER_PATTERN.test(normalized)
    ? normalized
    : null;
}

function parseOptionalMoment(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > MAX_MOMENT_LENGTH) {
    return undefined;
  }

  return value.trim() || null;
}

function parseOptionalCardReason(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > MAX_CARD_REASON_LENGTH) {
    return undefined;
  }

  return value.trim() || null;
}

function parseOptionalInstagram(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > MAX_INSTAGRAM_LENGTH + 1) {
    return undefined;
  }

  const trimmed = value.trim();
  const withoutAt = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  const normalized = withoutAt.toLowerCase();

  if (
    normalized.length === 0 ||
    normalized.length > MAX_INSTAGRAM_LENGTH ||
    !INSTAGRAM_PATTERN.test(normalized)
  ) {
    return undefined;
  }

  return normalized;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return invalidRequest();
  }

  let body: unknown;

  try {
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return invalidRequest();
    }

    body = JSON.parse(rawBody);
  } catch {
    return invalidRequest();
  }

  if (
    !isJsonRecord(body) ||
    Object.keys(body).some((key) => !REQUEST_KEYS.has(key))
  ) {
    return invalidRequest();
  }

  const boxCode = parseIdentifier(body.boxCode);
  const eventCode = parseIdentifier(body.eventCode);
  const favoriteCardId =
    body.favoriteCardId === null && body.favoriteCardId !== undefined
      ? null
      : isSocialGameCardId(body.favoriteCardId)
        ? body.favoriteCardId
        : undefined;
  const favoriteCardReason = parseOptionalCardReason(body.favoriteCardReason);
  const memorableMoment = parseOptionalMoment(body.memorableMoment);
  const instagramHandle = parseOptionalInstagram(body.instagramHandle);

  if (
    !boxCode ||
    !eventCode ||
    !Number.isInteger(body.rating) ||
    (body.rating as number) < 1 ||
    (body.rating as number) > 5 ||
    favoriteCardId === undefined ||
    favoriteCardReason === undefined ||
    typeof body.playAgain !== "boolean" ||
    typeof body.reconnectConsent !== "boolean" ||
    memorableMoment === undefined ||
    instagramHandle === undefined ||
    (body.reconnectConsent && !instagramHandle)
  ) {
    return invalidRequest();
  }

  try {
    const supabase = getServerSupabase();
    const { error } = await supabase.from("social_game_feedback").insert({
      box_code: boxCode,
      event_code: eventCode,
      rating: body.rating as number,
      favorite_card_id: favoriteCardId,
      favorite_card_reason:
        favoriteCardId === null ? null : favoriteCardReason,
      memorable_moment: memorableMoment,
      play_again: body.playAgain,
      instagram_handle: body.reconnectConsent ? instagramHandle : null,
      reconnect_consent: body.reconnectConsent,
    });

    if (error) {
      return NextResponse.json(
        { error: "Unable to submit feedback" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit feedback" },
      { status: 500 },
    );
  }
}
