import posthog from 'posthog-js';

// Initialize PostHog with environment variables
const posthogApiKey = process.env.REACT_APP_POSTHOG_API_KEY;
const posthogHost = process.env.REACT_APP_POSTHOG_HOST || 'https://us.posthog.com';

if (!posthogApiKey) {
    console.warn('PostHog API key not found in environment variables');
}

posthog.init(posthogApiKey || 'dummy_key', {
    api_host: posthogHost,
    loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
    },
    autocapture: true, // Automatically capture clicks, form submissions etc
    capture_pageview: true, // Automatically capture pageviews
    persistence: 'localStorage',
});

export default posthog;
