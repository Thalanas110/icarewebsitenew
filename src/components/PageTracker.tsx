import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageVisit } from '@/hooks/useAnalytics';

export function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track the page visit when the location changes
    trackPageVisit(location.pathname);
  }, [location.pathname]);

  // This component renders nothing
  return null;
}