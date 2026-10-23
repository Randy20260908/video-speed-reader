import { Outlet, redirect, useRouteLoaderData } from "react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export async function authenticatedLoader() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw redirect("/auth");
  return { user: data.user };
}

export function AuthenticatedLayout() {
  return <Outlet />;
}

export function useAuthenticatedUser(): User {
  const data = useRouteLoaderData("authenticated") as { user: User } | undefined;
  if (!data) throw new Error("useAuthenticatedUser must be used inside the authenticated route");
  return data.user;
}
