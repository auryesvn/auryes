import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

const VALID_CODE = /^[A-Z0-9_-]{1,64}$/;

function redirectHome(request: Request) {
  return NextResponse.redirect(new URL("/", request.url));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const normalizedCode = code.trim().toUpperCase();

  if (!VALID_CODE.test(normalizedCode)) {
    return redirectHome(request);
  }

  try {
    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from("redirects")
      .select("target_url, hits")
      .eq("code", normalizedCode)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return redirectHome(request);
    }

    const destination = new URL(data.target_url, request.url);

    if (destination.protocol !== "http:" && destination.protocol !== "https:") {
      return redirectHome(request);
    }

    // Best-effort and currently non-atomic; concurrent visits can lose increments.
    await supabase
      .from("redirects")
      .update({
        hits: (data.hits ?? 0) + 1,
        last_hit_at: new Date().toISOString(),
      })
      .eq("code", normalizedCode)
      .eq("is_active", true);

    return NextResponse.redirect(destination);
  } catch {
    return redirectHome(request);
  }
}
