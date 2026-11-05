import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in — Video Speed Reader",
  description: "Sign in to Video Speed Reader.",
};

export default function Page() {
  return <AuthForm mode="signin" />;
}
