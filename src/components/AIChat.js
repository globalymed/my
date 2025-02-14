import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import './AIChat.css';
import ClinicRecommender from './ClinicRecommender';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const SYSTEM_PROMPT = `You are a medical triage assistant. Your task is to:

Identify if symptoms match IVF/cosmetic/dental/hair 
Extract: duration, severity (1-10), affected area
Output JSON: {treatmentType: string, details: {duration: string, severity: number, area: string}}`;
const FALLBACK_RESPONSE = "Sorry, I'm having trouble. Please try again.";
const RATE_LIMIT = 3;
const RATE_LIMIT_INTERVAL = 60000; // 1 minute
const TIMEOUT_MS = 10000; // 10 seconds

const AIChat = () => {
  const [messages, setMessages] = useState([
    { text: SYSTEM_PROMPT, sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const [requestCount, setRequestCount] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [treatmentDetails, setTreatmentDetails] = useState(null);

  useEffect(() => {
    const history = localStorage.getItem('chatHistory');
    if (history) setMessages(JSON.parse(history));
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    // Rate limiting
    const now = Date.now();
    if (requestCount >= RATE_LIMIT && now - lastRequestTime < RATE_LIMIT_INTERVAL) {
      alert(`Please wait ${Math.ceil((RATE_LIMIT_INTERVAL - (now - lastRequestTime)) / 1000)} seconds before sending another message.`);
      setLoading(false);
      return;
    }

    // Check cache
    const cacheKey = JSON.stringify({ prompt: SYSTEM_PROMPT, input });
    const cachedResponse = sessionStorage.getItem(cacheKey);
    if (cachedResponse) {
      try {
        const parsedResponse = JSON.parse(cachedResponse);
        setTreatmentDetails(parsedResponse);
        setMessages((prev) => [...prev, { text: formatResponse(parsedResponse), sender: 'ai' }]);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Error parsing cached response:', err);
      }
    }

    // Exponential backoff
    let delay = 100;
    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetchWithTimeout(`https://gemini-api.com/chat`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_API_KEY}`
          },
          body: JSON.stringify({ 
            prompt: SYSTEM_PROMPT,
            input: sanitizeInput(input)
          }),
        }, TIMEOUT_MS);

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        try {
          const parsedResponse = JSON.parse(data.output);
          setTreatmentDetails(parsedResponse);
          const formattedResponse = formatResponse(parsedResponse);
          setMessages((prev) => [...prev, { text: formattedResponse, sender: 'ai' }]);
          sessionStorage.setItem(cacheKey, JSON.stringify(parsedResponse));
          break;
        } catch (err) {
          console.error('Error parsing API response:', err);
          setMessages((prev) => [...prev, { text: FALLBACK_RESPONSE, sender: 'ai' }]);
        }
      } catch (err) {
        console.error(err);
        if (i === 4) {
          alert('Error communicating with the AI. Please try again.');
        } else {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }

    setRequestCount((prev) => prev + 1);
    setLastRequestTime(now);
    setLoading(false);
  };

  const formatResponse = (response) => {
    return `I understand you're looking for ${response.treatmentType} treatment.
Duration: ${response.details.duration}
Severity: ${response.details.severity}/10
Affected Area: ${response.details.area}

Let me find the best clinics for you...`;
  };

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setMessages((prev) => [...prev, {
      text: `I recommend ${clinic.name}. Would you like to schedule an appointment?`,
      sender: 'ai'
    }]);
  };

  return (
    <Box className="ai-chat">
      <Typography variant="h5" className="header">
        ClinicBot Chat
      </Typography>
      <Box className="chat-history" ref={chatRef}>
        {messages.map((msg, idx) => (
          <Box 
            key={idx}
            className={`chat-bubble ${msg.sender}`}
          >
            {msg.text}
          </Box>
        ))}
        {loading && (
          <Box className="chat-bubble ai loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </Box>
        )}
      </Box>
      {treatmentDetails && !selectedClinic && (
        <ClinicRecommender
          treatmentType={treatmentDetails.treatmentType}
          onClinicSelect={handleClinicSelect}
        />
      )}
      <form onSubmit={handleSubmit} className="input-form">
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          fullWidth
          aria-label="Chat input"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </Box>
  );
};

function fetchWithTimeout(url, options, timeout) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

function sanitizeInput(input) {
  // Implement input sanitization against prompt injection attacks
  // ...
  return input;
}

export default AIChat; 