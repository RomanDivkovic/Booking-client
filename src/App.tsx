import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Todos from "./pages/Todos";
import Profile from "./pages/Profile";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import TOS from "./pages/TOS";
import NotFound from "./pages/NotFound";
import MainLayout from "@/components/MainLayout";
import { Analytics } from "@vercel/analytics/react";
import Invitations from "./pages/Invitations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/todos" element={<Todos />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/invitations" element={<Invitations />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/tos" element={<TOS />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
          </Routes>
          <Analytics />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
