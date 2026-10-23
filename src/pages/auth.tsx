import { AuthForm } from "@/components/auth-form";
import { usePageMeta } from "@/hooks/use-page-meta";

export function AuthPage() {
  usePageMeta("Sign in — Video Speed Reader", "Sign in to Video Speed Reader.");
  return <AuthForm mode="signin" />;
}
