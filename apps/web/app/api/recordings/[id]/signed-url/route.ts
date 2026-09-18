import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "লগইন করা প্রয়োজন।" }, { status: 401 });
  }

  // RLS on `recordings` already restricts this to: approved recordings (anyone),
  // the narrator's own recordings, or any recording if the caller is an admin.
  const { data: recording, error } = await supabase
    .from("recordings")
    .select("id,storage_path,duration_seconds,status")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching recording for signed URL:", error);
    return NextResponse.json({ error: "রেকর্ডিং খুঁজে পাওয়া যায়নি।" }, { status: 404 });
  }
  if (!recording || !recording.storage_path) {
    return NextResponse.json({ error: "এই রেকর্ডিংয়ের কোনো অডিও ফাইল নেই।" }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("recordings")
    .createSignedUrl(recording.storage_path, SIGNED_URL_TTL_SECONDS);

  if (signError || !signed) {
    console.error("Error creating signed URL:", signError);
    return NextResponse.json({ error: "অডিও লোড করা যায়নি।" }, { status: 500 });
  }

  return NextResponse.json({
    url: signed.signedUrl,
    durationSeconds: recording.duration_seconds,
  });
}