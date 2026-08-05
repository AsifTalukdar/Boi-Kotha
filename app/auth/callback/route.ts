import { NextResponse } from "next/server";
import { ensureListenerProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next") ?? "/";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/";

  if (!code) return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));

  await ensureListenerProfile(supabase, user);
  return NextResponse.redirect(new URL(next, request.url));
}
