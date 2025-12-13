import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PageTracker } from "@/components/PageTracker";
import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import ScrollToTop from "@/components/ScrollToTop";
import { useMinistries, useEvents, useServiceTimes } from "@/hooks/useChurchData";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Ministries from "./pages/Ministries";
import Events from "./pages/Events";
import Sermons from "./pages/Sermons";
import Contact from "./pages/Contact";
import Giving from "./pages/Giving";
import Gallery from "./pages/Gallery";
import Auth from "./pages/Auth";
import UpdatePassword from "./pages/UpdatePassword";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// ... (existing code)

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/about" element={<About />} />
  <Route path="/services" element={<Services />} />
  <Route path="/ministries" element={<Ministries />} />
  <Route path="/events" element={<Events />} />
  <Route path="/sermons" element={<Sermons />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/giving" element={<Giving />} />
  <Route path="/gallery" element={<Gallery />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/update-password" element={<UpdatePassword />} />
  <Route path="/admin" element={<Admin />} />
  <Route path="*" element={<NotFound />} />
</Routes>
            </BrowserRouter >
          </AppInitializer >
        </AuthProvider >
      </TooltipProvider >
    </QueryClientProvider >
  );
};

export default App;
