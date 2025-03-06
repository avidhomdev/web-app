import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");

  if (token_hash) {
    const supabase = await createSupabaseServerClient();

    // Exchange the token_hash for a session
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: "magiclink",
    });

    if (error) {
      return NextResponse.redirect(
        new URL("/sign-in?error=magiclink-auth-failed", request.url),
      );
    }

    // Successfully signed in, redirect to a protected page
    return NextResponse.redirect(new URL("/manage", request.url));
  }

  // Invalid request, redirect to sign-in
  return NextResponse.redirect(new URL("/sign-in", request.url));
}
