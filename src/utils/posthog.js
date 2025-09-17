import posthog from 'posthog-js';

const posthogApiKey = process.env.REACT_APP_POSTHOG_API_KEY;
const posthogHost = process.env.REACT_APP_POSTHOG_HOST || 'https://us.posthog.com';

let initializedPosthog = null;

function initPosthog() {
    if (initializedPosthog || !posthogApiKey || process.env.NODE_ENV !== 'production') {
        return posthog;
    }
    posthog.init(posthogApiKey, {
        api_host: posthogHost,
        capture_pageview: false,
        autocapture: true,
        persistence: 'localStorage',
    });
    initializedPosthog = posthog;
    return posthog;
}

if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => initPosthog());
    } else {
        setTimeout(() => initPosthog(), 2000);
    }
}

export default posthog;
export { initPosthog };
