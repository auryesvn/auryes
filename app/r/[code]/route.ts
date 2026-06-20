import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const normalizedCode = code.toUpperCase();

  const { data } = await supabase
    .from("redirects")
    .select("target_url, hits")
    .eq("code", normalizedCode)
    .eq("is_active", true)
    .single();

  if (!data) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  await supabase
    .from("redirects")
    .update({
      hits: (data.hits ?? 0) + 1,
      last_hit_at: new Date().toISOString(),
    })
    .eq("code", normalizedCode);

  return NextResponse.redirect(data.target_url);
}