import { getSupabaseServerClient } from "@/lib/supabase";

const LOVE_COUNTER_KEY = "love_this_idea";
const DEFAULT_LOVE_COUNT = 501;

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_counters")
      .select("value")
      .eq("key", LOVE_COUNTER_KEY)
      .maybeSingle();

    if (error) {
      console.error("Supabase love count read failed", error);
      return Response.json({ count: DEFAULT_LOVE_COUNT });
    }

    return Response.json({ count: data?.value ?? DEFAULT_LOVE_COUNT });
  } catch (error) {
    console.error("Supabase love count request failed", error);
    return Response.json({ count: DEFAULT_LOVE_COUNT });
  }
}

export async function POST() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc("increment_love_this_idea");

    if (error) {
      console.error("Supabase love count increment failed", error);
      return Response.json(
        { error: "Failed to save love count" },
        { status: 500 },
      );
    }

    return Response.json({ count: data ?? DEFAULT_LOVE_COUNT + 1 });
  } catch (error) {
    console.error("Supabase love count request failed", error);
    return Response.json(
      { error: "Supabase is not configured correctly" },
      { status: 500 },
    );
  }
}
