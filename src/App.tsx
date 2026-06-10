/* eslint-disable prettier/prettier */
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import ForecastingPage from "@/routes/forecasting";
import { useEffect, useState } from "react";
import { Bell, Search, LogOut } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { clearSession, getUser, initials, type SessionUser } from "@/lib/session";

import AuthPage from "@/routes/auth";
import Dashboard from "@/routes/index";
import PricingPage from "@/routes/pricing";
import InventoryPage from "@/routes/inventory";
import AnalyticsPage from "@/routes/analytics";
import UploadPage from "@/routes/upload";

function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const sync = () => setUser(getUser());
    sync();
    setHydrated(true);
    window.addEventListener("priceai:session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("priceai:session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { user, hydrated };
}

function ProtectedLayout() {
  const { user, hydrated } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  if (!hydrated) return null;
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl">
            <SidebarTrigger />
            <div className="hidden flex-1 md:block">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search products or regions…"
                  className="h-9 w-full rounded-md border border-border bg-card-elevated pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card-elevated text-muted-foreground transition hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
              </button>
              <div className="group relative">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                  {user ? initials(user.name) : "··"}
                </button>
                <div className="invisible absolute right-0 top-11 z-40 w-56 rounded-lg border border-border bg-card p-2 opacity-0 shadow-elevated transition group-hover:visible group-hover:opacity-100">
                  <div className="border-b border-border/60 px-3 py-2">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      clearSession();
                      navigate("/auth");
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-card-elevated hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AuthGate() {
  const { user, hydrated } = useSession();
  if (!hydrated) return null;
  if (user) return <Navigate to="/" replace />;
  return <AuthPage />;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthGate />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="forecasting" element={<ForecastingPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}