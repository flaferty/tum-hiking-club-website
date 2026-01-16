import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { Footer } from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Index from "./pages/Index";
import Organisers from "./pages/Organisers";
import Participants from "./pages/Participants";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import AddHike from "./pages/admin/AddHike";
import EditHike from "./pages/admin/EditHike";
import NotFound from "./pages/NotFound";
import Imprint from "./pages/legal/Imprint";
import Privacy from "./pages/legal/Privacy";
import { ThemeProvider } from "@/features/theme/ThemeProvider"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/imprint" element={<Imprint />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/organisers" element={<Organisers />} />
              <Route path="/participants" element={<Participants />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/add-hike" element={<AddHike />} />
              <Route path="/admin/edit-hike/:id" element={<EditHike />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
          <Analytics />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
