import { createBrowserRouter, type RouteObject } from "react-router";

import { RootLayout, ErrorComponent, NotFoundComponent } from "./pages/root";
import { Index } from "./pages/index";
import { AuthPage } from "./pages/auth";
import { SignupPage } from "./pages/signup";
import { AuthenticatedLayout, authenticatedLoader } from "./pages/authenticated";
import { AppPage } from "./pages/app";

export const routes: RouteObject[] = [
  {
    id: "root",
    element: <RootLayout />,
    errorElement: <ErrorComponent />,
    children: [
      { index: true, element: <Index /> },
      { path: "auth", element: <AuthPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        id: "authenticated",
        loader: authenticatedLoader,
        element: <AuthenticatedLayout />,
        HydrateFallback: () => null,
        children: [{ path: "app", element: <AppPage /> }],
      },
      { path: "*", element: <NotFoundComponent /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
