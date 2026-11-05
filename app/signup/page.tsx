import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign up — Video Speed Reader",
  description: "Create your Video Speed Reader account.",
};

export default function Page() {
  return <AuthForm mode="signup" />;
}
