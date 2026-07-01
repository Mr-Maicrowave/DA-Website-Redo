
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/animations/PageTransition";
import ScrollProgress from "@/components/animations/ScrollProgress";
import StickyBookButton from "@/components/StickyBookButton";
import Index from "./pages/Index";
import Interview from "./pages/Interview";
import BookInterview from "./pages/BookInterview";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";
import FindTeacher from "./pages/FindTeacher";
import Articles from "./pages/Articles";
import ArticleView from "./pages/ArticleView";
import AppreciationAdvice from "./pages/AppreciationAdvice";

import LearningFormats from "./pages/LearningFormats";
import HSCExcellence from "./pages/HSCExcellence";
import CanleyHeights from "./pages/locations/CanleyHeights";
import Cabramatta from "./pages/locations/Cabramatta";
import Fairfield from "./pages/locations/Fairfield";
import CanleyVale from "./pages/locations/CanleyVale";
import Smithfield from "./pages/locations/Smithfield";
import Lansvale from "./pages/locations/Lansvale";
import SuccessStories from "./pages/SuccessStories";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import WhyChooseDA from "./pages/WhyChooseDA";
import PrincipalReflections from "./pages/PrincipalReflections";
import PrincipalVoiceBook from "./pages/PrincipalVoiceBook";
import Subjects from "./pages/Subjects";
// Program pages
import PrimarySchool from "./pages/programs/PrimarySchool";
import HighSchool from "./pages/programs/HighSchool";
import EarlyYears from "./pages/programs/EarlyYears";
import Year34 from "./pages/programs/Year34";
import Year56 from "./pages/programs/Year56";
// Subject pages
import Mathematics from "./pages/subjects/Mathematics";
import English from "./pages/subjects/English";
import Science from "./pages/subjects/Science";
import BusinessStudies from "./pages/subjects/BusinessStudies";
import LegalStudies from "./pages/subjects/LegalStudies";
import Testimonials from "./pages/Testimonials";
import TestimonialDetail from "./pages/TestimonialDetail";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />

        <Route path="/interview" element={<PageTransition><Interview /></PageTransition>} />
        <Route path="/book-interview" element={<PageTransition><BookInterview /></PageTransition>} />
        <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
        <Route path="/find-teacher" element={<PageTransition><FindTeacher /></PageTransition>} />
        <Route path="/teachers" element={<Navigate to="/find-teacher" replace />} />
        <Route path="/articles" element={<PageTransition><Articles /></PageTransition>} />
        <Route path="/articles/:slug" element={<PageTransition><ArticleView /></PageTransition>} />
        <Route path="/appreciation-advice" element={<PageTransition><AppreciationAdvice /></PageTransition>} />
        <Route path="/learning-formats" element={<PageTransition><LearningFormats /></PageTransition>} />
        <Route path="/hsc-excellence" element={<PageTransition><HSCExcellence /></PageTransition>} />
        <Route path="/our-teachers" element={<Navigate to="/find-teacher" replace />} />
        <Route path="/tutoring-canley-heights" element={<PageTransition><CanleyHeights /></PageTransition>} />
        <Route path="/tutoring-cabramatta" element={<PageTransition><Cabramatta /></PageTransition>} />
        <Route path="/tutoring-fairfield" element={<PageTransition><Fairfield /></PageTransition>} />
        <Route path="/tutoring-canley-vale" element={<PageTransition><CanleyVale /></PageTransition>} />
        <Route path="/tutoring-smithfield" element={<PageTransition><Smithfield /></PageTransition>} />
        <Route path="/tutoring-lansvale" element={<PageTransition><Lansvale /></PageTransition>} />
        <Route path="/success-stories" element={<PageTransition><SuccessStories /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/our-approach" element={<PageTransition><WhyChooseDA /></PageTransition>} />
        <Route path="/why-choose-da" element={<PageTransition><WhyChooseDA /></PageTransition>} />
        <Route path="/principal-reflections" element={<PageTransition><PrincipalReflections /></PageTransition>} />
        <Route path="/principal-voice-book" element={<PageTransition><PrincipalVoiceBook /></PageTransition>} />
        <Route path="/subjects" element={<PageTransition><Subjects /></PageTransition>} />

        {/* Program Routes */}
        <Route path="/programs/primary-school" element={<PageTransition><PrimarySchool /></PageTransition>} />
        <Route path="/programs/early-years" element={<PageTransition><EarlyYears /></PageTransition>} />
        <Route path="/programs/year-3-4" element={<PageTransition><Year34 /></PageTransition>} />
        <Route path="/programs/year-5-6" element={<PageTransition><Year56 /></PageTransition>} />
        <Route path="/programs/high-school" element={<PageTransition><HighSchool /></PageTransition>} />
        <Route path="/programs/hsc" element={<PageTransition><HSCExcellence /></PageTransition>} />

        {/* Subject Routes */}
        <Route path="/subjects/mathematics" element={<PageTransition><Mathematics /></PageTransition>} />
        <Route path="/subjects/english" element={<PageTransition><English /></PageTransition>} />
        <Route path="/subjects/science" element={<PageTransition><Science /></PageTransition>} />
        <Route path="/subjects/business-studies" element={<PageTransition><BusinessStudies /></PageTransition>} />
        <Route path="/subjects/legal-studies" element={<PageTransition><LegalStudies /></PageTransition>} />

        {/* Testimonials */}
        <Route path="/testimonials" element={<PageTransition><Testimonials /></PageTransition>} />
        <Route path="/testimonials/:slug" element={<PageTransition><TestimonialDetail /></PageTransition>} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollProgress />
          <StickyBookButton />
          <div
            className="min-h-screen overflow-x-hidden gradient-transition"
            style={{
              background:
                'linear-gradient(180deg, rgba(249, 250, 251, 1) 0%, rgba(239, 246, 255, 0.95) 40%, rgba(219, 234, 254, 0.5) 70%, rgba(147, 197, 253, 0.3) 100%)',
            }}
          >
            <AnimatedRoutes />
            <ScrollToTop />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
