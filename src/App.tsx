
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import AppLayout from "@/components/layout/AppLayout";
import Today from "@/pages/Today";
import Habits from "@/pages/Habits";
import Journal from "@/pages/Journal";
import Affirmations from "@/pages/Affirmations";
import Meditations from "@/pages/Meditations";
import Coach from "@/pages/Coach";
import MoodAnalytics from "@/pages/MoodAnalytics";
import NotFound from "@/pages/NotFound";
import { ensureDailyAffirmation } from "@/services/dataService";

const queryClient = new QueryClient();

const App = () => {
  // Ensure we have a daily affirmation on app load
  useEffect(() => {
    ensureDailyAffirmation();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Today />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/affirmations" element={<Affirmations />} />
              <Route path="/meditations" element={<Meditations />} />
              <Route path="/coach" element={<Coach />} />
              <Route path="/mood" element={<Today />} />
              <Route path="/mood/analytics" element={<MoodAnalytics />} />
              <Route path="/settings" element={<Today />} />
              <Route path="/explore" element={<Today />} />
              <Route path="/profile" element={<Today />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
