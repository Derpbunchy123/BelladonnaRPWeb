import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Rules from "@/pages/Rules";
import Apply from "@/pages/Apply";
import Store from "@/pages/Store";
import Departments from "@/pages/Departments";
import Community from "@/pages/Community";
import BetaTesting from "@/pages/BetaTesting";
import CityLore from "@/pages/CityLore";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AuthCallback from "@/pages/AuthCallback";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin routes — no Layout wrapper (no nav/footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Auth callback — no Layout wrapper */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* Main site routes — wrapped in Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/lore" element={<CityLore />} />
                  <Route path="/rules" element={<Rules />} />
                  <Route path="/apply" element={<Apply />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/beta-testing" element={<BetaTesting />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

export default App;
