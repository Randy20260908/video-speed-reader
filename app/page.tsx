import type { Metadata } from "next";
import { Landing } from "@/views/landing";

export const metadata: Metadata = {
  title: "Video Speed Reader — Transcripts in three minutes",
  description:
    "Upload your video, get a clean, accurate transcript in three minutes. Chinese and English supported.",
};

export default function Page() {
  return <Landing />;
}
