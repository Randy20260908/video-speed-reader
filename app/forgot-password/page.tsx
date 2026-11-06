import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password — Video Speed Reader",
  description: "Reset your Video Speed Reader password.",
};

export default function Page() {
  return <ForgotPasswordForm />;
}
