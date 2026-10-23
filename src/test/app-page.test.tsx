import { render, screen } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { describe, expect, it, vi } from "vitest";

import { routes } from "@/router";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: async () => ({ data: { user: { email: "test@example.com" } } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

describe("/app", () => {
  it("renders the dashboard for a signed-in user", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/app"] });
    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Hi test@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });
});
