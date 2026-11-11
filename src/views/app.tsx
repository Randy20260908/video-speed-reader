"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Footer, Logo } from "@/components/site";

export function AppPage({ email }: { email: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
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
            <Button asChild className="bg-gradient-primary hover:opacity-90">
              <Link href="/upload">Upload</Link>
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-20 sm:px-6">
        <h1 className="break-words text-3xl font-bold sm:text-4xl">Hi {email}</h1>
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-8 text-muted-foreground">
          Ready to transcribe?{" "}
          <Link href="/upload" className="text-primary-glow hover:underline">
            Submit a video URL →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
