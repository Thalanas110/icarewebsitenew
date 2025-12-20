// Netlify Function: Fetch latest video from Facebook Page
// Endpoint: /.netlify/functions/facebook-latest-video

export async function handler(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    try {
        const appId = process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.FACEBOOK_APP_SECRET;
        const pageId = process.env.FACEBOOK_PAGE_ID;

        // Validate environment variables
        if (!appId || !appSecret || !pageId) {
            console.error('Missing Facebook environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Facebook API not configured',
                    fallbackUrl: null,
                }),
            };
        }

        // Get App Access Token
        const accessToken = `${appId}|${appSecret}`;

        // Fetch the latest video from the page
        // Using videos edge with limit=1 to get the most recent video
        const graphUrl = `https://graph.facebook.com/v18.0/${pageId}/videos?fields=id,title,permalink_url,embed_html,created_time,length&limit=1&access_token=${accessToken}`;

        const response = await fetch(graphUrl);
        const data = await response.json();

        if (data.error) {
            console.error('Facebook API error:', data.error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: data.error.message,
                    fallbackUrl: null,
                }),
            };
        }

        if (!data.data || data.data.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'No videos found on page',
                    fallbackUrl: null,
                }),
            };
        }

        const latestVideo = data.data[0];

        // Construct the video URL for embedding
        const videoUrl = `https://www.facebook.com/facebook/videos/${latestVideo.id}/`;

        // Also try to get the page's actual permalink if available
        const embedUrl = latestVideo.permalink_url
            ? `https://www.facebook.com${latestVideo.permalink_url}`
            : videoUrl;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                video: {
                    id: latestVideo.id,
                    title: latestVideo.title || 'Latest Video',
                    url: embedUrl,
                    createdTime: latestVideo.created_time,
                    duration: latestVideo.length,
                },
            }),
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to fetch video',
                message: error.message,
            }),
        };
    }
}
