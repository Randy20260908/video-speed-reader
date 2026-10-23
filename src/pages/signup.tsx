import { AuthForm } from "@/components/auth-form";
import { usePageMeta } from "@/hooks/use-page-meta";

export function SignupPage() {
  usePageMeta("Sign up — Video Speed Reader", "Create your Video Speed Reader account.");
  return <AuthForm mode="signup" />;
}
