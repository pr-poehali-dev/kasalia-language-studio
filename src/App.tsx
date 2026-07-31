
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PickHero from "./pages/PickHero";
import PricePrint from "./pages/PricePrint";
import CoursesPrint from "./pages/CoursesPrint";
import SchedulePrint from "./pages/SchedulePrint";
import BlogPost from "./pages/BlogPost";
import Teacher from "./pages/Teacher";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pick-hero" element={<PickHero />} />
          <Route path="/print/price" element={<PricePrint />} />
          <Route path="/print/courses" element={<CoursesPrint />} />
          <Route path="/print/schedule" element={<SchedulePrint />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;