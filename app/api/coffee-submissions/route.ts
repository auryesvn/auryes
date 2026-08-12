import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { COFFEE_QUIZ_VERSION, computeCoffeeResult, isAddressMode, isCompleteAnswers, normalizeInstagram } from "@/lib/coffee-quiz";

const MAX_REQUEST_BYTES = 4_096;
const REQUEST_KEYS = new Set(["quizVersion", "name", "instagram", "addressMode", "answers"]);

function invalidRequest() { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return invalidRequest();
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) return invalidRequest();
  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_REQUEST_BYTES) return invalidRequest();
    body = JSON.parse(raw);
  } catch { return invalidRequest(); }
  if (!isRecord(body) || Object.keys(body).some((key) => !REQUEST_KEYS.has(key))) return invalidRequest();
  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const instagram = typeof body.instagram === "string" ? normalizeInstagram(body.instagram) : undefined;
  if (body.quizVersion !== COFFEE_QUIZ_VERSION || !isAddressMode(body.addressMode) || !isCompleteAnswers(body.answers) || name.length < 1 || name.length > 80 || instagram === undefined) return invalidRequest();
  const result = computeCoffeeResult(body.answers);
  try {
    const { error } = await getServerSupabase().from("coffee_quiz_submissions").insert({
      quiz_version: COFFEE_QUIZ_VERSION,
      name,
      instagram_handle: instagram,
      address_mode: body.addressMode,
      answers: body.answers,
      verdict_key: result.verdictKey,
      profile_snapshot: { keys: result.profileKeys },
    });
    if (error) return NextResponse.json({ error: "Unable to submit quiz" }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "Unable to submit quiz" }, { status: 500 }); }
}
