import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import CourseDetail from "./pages/CourseDetail";
import CourseTestPage from "./pages/CourseTest";
import Jobs from "./pages/Jobs";
import JobApplication from "./pages/JobApplication";
import SubmitWork from "./pages/SubmitWork";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import ContentGenerator from "./pages/ContentGenerator";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:courseId" element={<CourseDetail />} />
          <Route path="/learn/:courseId/test" element={<CourseTestPage />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/apply/:jobId" element={<JobApplication />} />
          <Route path="/jobs/submit" element={<SubmitWork />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/content-generator" element={<ContentGenerator />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
