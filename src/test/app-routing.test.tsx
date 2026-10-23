import { matchRoutes } from "react-router";
import { describe, expect, it } from "vitest";

import { routes } from "@/router";

// Match routes without running loaders or rendering: loaders may need a network
// the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it.each(["/", "/auth", "/signup", "/app"])("matches a page for %s instead of falling back to not found", (url) => {
    const matches = matchRoutes(routes, url);

    expect(matches?.at(-1)?.route.path).not.toBe("*");
  });
});
