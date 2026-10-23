import { Link } from "react-router";
import { AudioLines, Timer, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer, Logo, Reveal } from "@/components/site";
import { usePageMeta } from "@/hooks/use-page-meta";

const features = [
  { icon: AudioLines, title: "高準確度逐字稿", en: "High-accuracy transcripts", body: "Powered by OpenAI Whisper. Supports Chinese and English." },
  { icon: Timer, title: "三分鐘交付", en: "Three-minute turnaround", body: "Processed in the background — you get an email when it's ready." },
  { icon: BadgeCheck, title: "可商用授權", en: "Commercial-use ready", body: "You own the output. Use it however you like." },
];

export function Index() {
  usePageMeta(
    "Video Speed Reader — Transcripts in three minutes",
    "Upload your video, get a clean, accurate transcript in three minutes. Chinese and English supported.",
  );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Button asChild className="bg-gradient-primary shadow-glow hover:opacity-90">
            <Link to="/auth">Sign in / 登入</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-[-10rem] h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
            <Reveal>
              <p className="mb-6 inline-block rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                For creators, educators & engineers
              </p>
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
                <span className="text-gradient">Video Speed Reader</span>
              </h1>
              <p className="mt-6 text-2xl font-medium sm:text-3xl">上傳影片，三分鐘內拿到逐字稿。</p>
              <p className="mt-3 text-lg text-muted-foreground">Upload your video, get a clean transcript in three minutes.</p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-gradient-primary shadow-glow hover:opacity-90">
                  <Link to="/signup">Get started free</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/auth">Sign in / 登入</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.en} delay={i * 120}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary-glow">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {f.title} <span className="text-muted-foreground">({f.en})</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
