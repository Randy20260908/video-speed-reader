import { Link } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { PlayCircle } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary shadow-glow">
        <PlayCircle className="h-4 w-4 text-primary-foreground" />
      </span>
      Video Speed Reader
    </Link>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
      © 2026 Video Speed Reader
    </footer>
  );
}
