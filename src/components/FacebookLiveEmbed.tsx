import { useEffect, useRef, useState } from 'react';

// Declare FB on window for TypeScript
declare global {
    interface Window {
        FB?: {
            XFBML: {
                parse: (element?: HTMLElement) => void;
            };
        };
    }
}

interface FacebookLiveEmbedProps {
    fallbackVideoUrl?: string;
    showText?: boolean;
    className?: string;
}

interface VideoData {
    id: string;
    title: string;
    url: string;
    createdTime: string;
    duration?: number;
}

/**
 * Client-only Facebook Live video embed component.
 * Automatically fetches the latest video from the Facebook page using the Graph API.
 */
export const FacebookLiveEmbed = ({
    fallbackVideoUrl = 'https://www.facebook.com/icarefellowship/videos/1498018767949004/',
    showText = false,
    className = '',
}: FacebookLiveEmbedProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch latest video from API
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const fetchLatestVideo = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/facebook-latest-video');
                const data = await response.json();

                if (data.success && data.video?.url) {
                    setVideoUrl(data.video.url);
                    setError(null);
                } else {
                    // Use fallback if API fails or returns no video
                    console.warn('Facebook API returned no video, using fallback:', data.error);
                    setVideoUrl(fallbackVideoUrl);
                    setError(data.error || 'No video found');
                }
            } catch (err) {
                console.error('Failed to fetch latest video:', err);
                setVideoUrl(fallbackVideoUrl);
                setError('Failed to fetch latest video');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestVideo();
    }, [fallbackVideoUrl]);

    // Initialize Facebook SDK and parse when video URL changes
    useEffect(() => {
        if (typeof window === 'undefined' || !videoUrl) return;

        const initFacebookSDK = () => {
            if (window.FB) {
                // SDK already loaded, just re-parse
                if (containerRef.current) {
                    window.FB.XFBML.parse(containerRef.current);
                }
            } else {
                // Load the SDK
                (function (d: Document, s: string, id: string) {
                    const fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    const js = d.createElement(s) as HTMLScriptElement;
                    js.id = id;
                    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
                    js.async = true;
                    js.defer = true;
                    fjs.parentNode?.insertBefore(js, fjs);
                })(document, 'script', 'facebook-jssdk');

                // Wait for SDK to load and then parse
                const checkFB = setInterval(() => {
                    if (window.FB && containerRef.current) {
                        window.FB.XFBML.parse(containerRef.current);
                        clearInterval(checkFB);
                    }
                }, 100);

                // Cleanup if component unmounts before SDK loads
                return () => clearInterval(checkFB);
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(initFacebookSDK, 100);
        return () => clearTimeout(timer);
    }, [videoUrl]);

    // SSR placeholder
    if (typeof window === 'undefined') {
        return (
            <div className={`bg-black aspect-video flex items-center justify-center ${className}`}>
                <span className="text-white">Loading live stream...</span>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className={`bg-black aspect-video flex items-center justify-center ${className}`}>
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mb-2"></div>
                    <p className="text-white/70 text-sm">Loading latest video...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={className} style={{ width: '100%' }}>
            <div
                className="fb-video"
                data-href={videoUrl}
                data-width="auto"
                data-show-text={showText.toString()}
                data-autoplay="false"
                data-allowfullscreen="true"
                data-lazy="true"
            />
        </div>
    );
};

export default FacebookLiveEmbed;
