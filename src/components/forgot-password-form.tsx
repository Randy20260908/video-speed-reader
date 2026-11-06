"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8"><Logo /></div>
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-8 shadow-glow">
        <div>
          <h1 className="text-2xl font-semibold">Reset password / 重設密碼</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sent
              ? "If that email has an account, a reset link is on its way. Open it in this same browser."
              : "We'll email you a link to set a new password."}
          </p>
        </div>
        {!sent && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-primary hover:opacity-90">
              {loading ? "Please wait…" : "Send reset link"}
            </Button>
          </>
        )}
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/auth" className="text-primary-glow hover:underline">Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}
