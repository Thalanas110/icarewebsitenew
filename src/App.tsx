import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PageTracker } from "@/components/PageTracker";
import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import { useMinistries, useEvents, useServiceTimes } from "@/hooks/useChurchData";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Ministries from "./pages/Ministries";
import Events from "./pages/Events";
import Sermons from "./pages/Sermons";
import Contact from "./pages/Contact";
import Giving from "./pages/Giving";
import Auth from "./pages/Auth";
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

const BIBLE_VERSES = [
  { verse: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", reference: "Jeremiah 29:11" },
  { verse: "Trust in the Lord with all your heart, and do not lean on your own understanding.", reference: "Proverbs 3:5" },
  { verse: "I can do all things through him who strengthens me.", reference: "Philippians 4:13" },
  { verse: "Be strong and courageous. Do not fear or be in dread, for the Lord your God is with you wherever you go.", reference: "Joshua 1:9" },
  { verse: "And we know that for those who love God all things work together for good.", reference: "Romans 8:28" },
  { verse: "Cast all your anxieties on him, because he cares for you.", reference: "1 Peter 5:7" },
  { verse: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
  { verse: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me.", reference: "Psalm 23:4" },
  { verse: "Come to me, all who labor and are heavy laden, and I will give you rest.", reference: "Matthew 11:28" },
  { verse: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.", reference: "John 3:16" },
  { verse: "The steadfast love of the Lord never ceases; his mercies never come to an end.", reference: "Lamentations 3:22" },
  { verse: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.", reference: "Isaiah 40:31" },
  { verse: "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you.", reference: "John 14:27" },
  { verse: "And my God will supply every need of yours according to his riches in glory in Christ Jesus.", reference: "Philippians 4:19" },
  { verse: "Have I not commanded you? Be strong and courageous! Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" },
  { verse: "The Lord your God is in your midst, a mighty one who will save; he will rejoice over you with gladness.", reference: "Zephaniah 3:17" },
  { verse: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.", reference: "Matthew 6:34" },
  { verse: "For we walk by faith, not by sight.", reference: "2 Corinthians 5:7" },
  { verse: "But seek first the kingdom of God and his righteousness, and all these things will be added to you.", reference: "Matthew 6:33" },
  { verse: "The name of the Lord is a strong tower; the righteous run into it and are safe.", reference: "Proverbs 18:10" },
  { verse: "He heals the brokenhearted and binds up their wounds.", reference: "Psalm 147:3" },
  { verse: "Greater love has no one than this, that someone lay down his life for his friends.", reference: "John 15:13" },
  { verse: "And God is able to make all grace abound to you, so that having all sufficiency in all things at all times, you may abound in every good work.", reference: "2 Corinthians 9:8" },
  { verse: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.", reference: "Philippians 4:6" },
  { verse: "The Lord is near to the brokenhearted and saves the crushed in spirit.", reference: "Psalm 34:18" },
  { verse: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.'", reference: "2 Corinthians 12:9" },
  { verse: "For nothing will be impossible with God.", reference: "Luke 1:37" },
  { verse: "And let us not grow weary of doing good, for in due season we will reap, if we do not give up.", reference: "Galatians 6:9" },
  { verse: "The Lord will fight for you, and you have only to be silent.", reference: "Exodus 14:14" },
  { verse: "Wait for the Lord; be strong, and let your heart take courage; wait for the Lord!", reference: "Psalm 27:14" },
  { verse: "In all your ways acknowledge him, and he will make straight your paths.", reference: "Proverbs 3:6" },
  { verse: "The joy of the Lord is your strength.", reference: "Nehemiah 8:10" },
  { verse: "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.", reference: "2 Corinthians 5:17" },
  { verse: "Delight yourself in the Lord, and he will give you the desires of your heart.", reference: "Psalm 37:4" },
  { verse: "The Lord bless you and keep you; the Lord make his face to shine upon you and be gracious to you.", reference: "Numbers 6:24-25" },
  { verse: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.", reference: "Ephesians 2:8" },
  { verse: "And we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.", reference: "Ephesians 2:10" },
  { verse: "Let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven.", reference: "Matthew 5:16" },
  { verse: "Above all, keep loving one another earnestly, since love covers a multitude of sins.", reference: "1 Peter 4:8" },
  { verse: "And now these three remain: faith, hope and love. But the greatest of these is love.", reference: "1 Corinthians 13:13" },
  { verse: "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.", reference: "Ephesians 4:32" },
  { verse: "Commit your way to the Lord; trust in him, and he will act.", reference: "Psalm 37:5" },
  { verse: "The Lord is my light and my salvation; whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?", reference: "Psalm 27:1" },
  { verse: "For his anger is but for a moment, and his favor is for a lifetime. Weeping may tarry for the night, but joy comes with the morning.", reference: "Psalm 30:5" },
  { verse: "Create in me a clean heart, O God, and renew a right spirit within me.", reference: "Psalm 51:10" },
  { verse: "The Lord is good to those who wait for him, to the soul who seeks him.", reference: "Lamentations 3:25" },
  { verse: "Call to me and I will answer you, and will tell you great and hidden things that you have not known.", reference: "Jeremiah 33:3" },
  { verse: "No weapon that is fashioned against you shall succeed, and you shall refute every tongue that rises against you in judgment.", reference: "Isaiah 54:17" },
  { verse: "But he knows the way that I take; when he has tried me, I shall come out as gold.", reference: "Job 23:10" },
  { verse: "The Lord is righteous in all his ways and kind in all his works.", reference: "Psalm 145:17" }
];

// Component to check internet connectivity and initial data loading
function AppInitializer({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasInitialData, setHasInitialData] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(BIBLE_VERSES[0]);
  const [progress, setProgress] = useState(0);

  // Check internet connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch critical data for initial load
  const ministriesQuery = useMinistries();
  const eventsQuery = useEvents(); 
  const serviceTimesQuery = useServiceTimes();

  const criticalQueries = [ministriesQuery, eventsQuery, serviceTimesQuery];
  const allQueriesLoaded = criticalQueries.every(query => 
    query.isSuccess || query.isError
  );
  const anyQueryLoading = criticalQueries.some(query => query.isLoading);

  // Update progress based on query states
  useEffect(() => {
    if (!isOnline) {
      setProgress(0);
      return;
    }

    const successfulQueries = criticalQueries.filter(query => query.isSuccess).length;
    const errorQueries = criticalQueries.filter(query => query.isError).length;
    const completedQueries = successfulQueries + errorQueries;
    const totalQueries = criticalQueries.length;
    
    const calculatedProgress = (completedQueries / totalQueries) * 100;
    
    // Smooth progress transition
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const target = calculatedProgress;
        if (Math.abs(prev - target) < 1) {
          clearInterval(progressInterval);
          return target;
        }
        return prev + (target - prev) * 0.1;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [criticalQueries.map(q => q.status).join(','), isOnline]);

  // Check if initial data loading is complete
  useEffect(() => {
    if (isOnline && allQueriesLoaded && !anyQueryLoading) {
      // Add a small delay to ensure smooth UX
      const timer = setTimeout(() => setHasInitialData(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, allQueriesLoaded, anyQueryLoading]);

  // Bible verse rotation
  useEffect(() => {
    // Set initial random verse
    const randomIndex = Math.floor(Math.random() * BIBLE_VERSES.length);
    setCurrentVerse(BIBLE_VERSES[randomIndex]);

    // Change verse every 3 seconds
    const verseInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * BIBLE_VERSES.length);
      setCurrentVerse(BIBLE_VERSES[randomIndex]);
    }, 3000);

    return () => clearInterval(verseInterval);
  }, []);

  // Show loading screen while offline or data is loading
  if (!isOnline || !hasInitialData) {
    const loadingText = !isOnline 
      ? "Connecting..." 
      : anyQueryLoading 
        ? "Loading church data..." 
        : "Loading.";

    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        {/* Cross Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-church-orange rounded-lg flex items-center justify-center">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white"
            >
              <path 
                d="M12 2L12 22M2 12L22 12" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-800">{loadingText}</h2>
        </div>

        {/* Bible Verse */}
        <div className="mb-8 max-w-lg text-center px-6">
          <p className="text-gray-600 italic text-sm leading-relaxed">
            {currentVerse.verse}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            - {currentVerse.reference}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-church-orange transition-all duration-300 ease-out"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppInitializer>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <PageTracker />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/ministries" element={<Ministries />} />
                <Route path="/events" element={<Events />} />
                <Route path="/sermons" element={<Sermons />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/giving" element={<Giving />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AppInitializer>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
