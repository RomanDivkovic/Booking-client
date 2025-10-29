import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import MainLayout from "@/components/MainLayout";
import { PageTransition } from "@/components/PageTransition";
import { useLocation } from "@tanstack/react-router";

function RootComponent() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth");

  if (isAuthRoute) {
    return (
      <>
        <PageTransition>
          <Outlet />
        </PageTransition>
        <TanStackRouterDevtools />
      </>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageTransition>
          <Outlet />
        </PageTransition>
        <TanStackRouterDevtools />
      </MainLayout>
    </ProtectedRoute>
  );
}

export const Route = createRootRoute({
  component: RootComponent
});
