import { getSupabaseServerClient } from "@/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistPayload = {
  email?: unknown;
  role?: unknown;
  country?: unknown;
  instagram_url?: unknown;
};

export async function POST(request: Request) {
  let payload: WaitlistPayload;

  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email =
    typeof payload.email === "string"
      ? payload.email.trim().toLowerCase()
      : "";

  if (!EMAIL_REGEX.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const role = typeof payload.role === "string" ? payload.role : "user";
  if (role !== "user" && role !== "creator") {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  const country =
    typeof payload.country === "string" ? payload.country.trim() : "";
  if (!country) {
    return Response.json({ error: "Country is required" }, { status: 400 });
  }

  const instagramUrl =
    role === "creator" && typeof payload.instagram_url === "string"
      ? payload.instagram_url.trim()
      : null;

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("waitlist").upsert(
      { email, role, country, instagram_url: instagramUrl },
      { onConflict: "email", ignoreDuplicates: true },
    );

    if (error) {
      console.error("Supabase waitlist insert failed", error);
      return Response.json(
        { error: "Failed to save waitlist entry" },
        { status: 500 },
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Supabase waitlist request failed", error);
    return Response.json(
      { error: "Supabase is not configured correctly" },
      { status: 500 },
    );
  }
}
