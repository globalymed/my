import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './pages/App';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

const theme = createTheme();

posthog.init(process.env.REACT_APP_POSTHOG_API_KEY, {
  api_host: 'https://us.posthog.com',
  capture_pageview: false, 
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PostHogProvider client={posthog}>
          <App />
        </PostHogProvider>
      </ThemeProvider>
    </BrowserRouter>
); 