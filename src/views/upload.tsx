"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { Download, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer, Logo } from "@/components/site";

export type JobRow = {
  id: string;
  created_at: string;
  video_source_url: string;
  status: "pending" | "downloading" | "transcribe" | "done";
};

const STATUS_STYLE: Record<JobRow["status"], string> = {
  pending: "bg-muted text-muted-foreground",
  downloading: "bg-muted text-muted-foreground",
  transcribe: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  done: "bg-green-500/15 text-green-700 dark:text-green-300",
};

function truncate(s: string, n = 50) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function UploadView({ email, jobs }: { email: string; jobs: JobRow[] }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("zh");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // While any job is still in progress, re-fetch the list every 10 s
  // (same cadence as the worker's poll) so status badges move on their own.
  const inProgress = jobs.some((j) => j.status !== "done");
  useEffect(() => {
    if (!inProgress) return;
    const t = setInterval(() => router.refresh(), 10_000);
    return () => clearInterval(t);
  }, [inProgress, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_source_url: url.trim(), topic: topic.trim() || null, language }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? `Request failed (${res.status})`);
      return;
    }
    setUrl("");
    setTopic("");
    router.refresh();
  }

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/auth");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/app">Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-10 px-4 py-12 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold">Transcribe / 逐字稿</h1>
          <p className="mt-1 break-words text-sm text-muted-foreground">Signed in as {email}</p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          {jobs.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">
              No transcriptions yet. Submit your first video below.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">URL</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Transcript</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-border last:border-0">
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-4 py-3" title={job.video_source_url}>
                        {truncate(job.video_source_url)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[job.status]}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {job.status === "done" ? (
                          <a
                            href={`/api/jobs/${job.id}/transcript`}
                            download={`transcript-${job.id.slice(0, 8)}.txt`}
                            className="inline-flex items-center gap-1 text-primary-glow hover:underline"
                          >
                            <Download className="h-4 w-4" /> .txt
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold">New transcription</h2>
          <div className="space-y-2">
            <Label htmlFor="url">Video URL</Label>
            <Input
              id="url"
              type="url"
              required
              placeholder="Direct mp4 / mp3 URL (e.g. CloudFront, Vimeo, Internet Archive)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">YouTube links aren't supported yet.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic (optional)</Label>
            <Input
              id="topic"
              placeholder="e.g. Tech podcast — useful context for the model"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="zh">zh — 中文</option>
              <option value="en">en — English</option>
              <option value="ja">ja — 日本語</option>
            </select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting} className="bg-gradient-primary hover:opacity-90">
            {submitting ? "Submitting…" : "Transcribe"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
