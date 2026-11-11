import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UploadView, type JobRow } from "@/views/upload";

export const metadata: Metadata = {
  title: "Transcribe — Video Speed Reader",
  description: "Submit a video URL and download its transcript.",
};

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // RLS ("users read own jobs") limits this to the signed-in user's rows;
  // the explicit user_id filter keeps the intent obvious.
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, created_at, video_source_url, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return <UploadView email={user.email ?? ""} jobs={(jobs ?? []) as JobRow[]} />;
}
