import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "./supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

type RequestContext = {
  params: Record<string, string>;
  supabase: SupabaseClient<Database>;
};

type RouteHandlerProps = (
  request: NextRequest,
  context: RequestContext,
) => Promise<NextResponse>;

export function routeHandlerWithJwtSupabaseAuth(handler: RouteHandlerProps) {
  return async (request: NextRequest, context: RequestContext) => {
    const headersList = await request.headers;

    const authHeader = headersList.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid Authorization header" },
        { status: 401 },
      );
    }
    const jwt = authHeader.split(" ")[1];

    const supabase = await createSupabaseServerClient({ jwt });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(jwt);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    return handler(request, {
      ...context,
      supabase,
    });
  };
}
