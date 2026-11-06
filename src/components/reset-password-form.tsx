"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site";

// `hasSession` comes from the server: the reset link's ?code= is exchanged for a
// session in middleware.ts before this page renders.
export function ResetPasswordForm({ hasSession }: { hasSession: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated.");
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8"><Logo /></div>
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-8 shadow-glow">
        <div>
          <h1 className="text-2xl font-semibold">Set a new password / 設定新密碼</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasSession
              ? "Choose a new password for your account."
              : "This reset link is invalid or has expired. Request a new one and open it in this same browser."}
          </p>
        </div>
        {hasSession ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-primary hover:opacity-90">
              {loading ? "Please wait…" : "Update password"}
            </Button>
          </>
        ) : (
          <Button asChild className="w-full bg-gradient-primary hover:opacity-90">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
        )}
      </form>
    </div>
  );
}
