import React, { useState, useRef, useEffect } from 'react';

const AiAssistantContent = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello, I'm your AI assistant. How can I help you today? You can ask me about your patients, appointments, or medical information.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Enhanced response formatting function
  const formatResponse = (text) => {
    const lines = text.split('\n');
    const formattedElements = [];
    let currentSection = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        if (currentSection.length > 0) {
          formattedElements.push(currentSection);
          currentSection = [];
        }
        return;
      }
      
      // Check for headers (lines starting with **)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        if (currentSection.length > 0) {
          formattedElements.push(currentSection);
          currentSection = [];
        }
        formattedElements.push({
          type: 'header',
          content: trimmedLine.replace(/^\*\*|\*\*$/g, ''),
          key: `header-${index}`
        });
        return;
      }
      
      // Check for bullet points
      if (trimmedLine.startsWith('* ')) {
        currentSection.push({
          type: 'bullet',
          content: trimmedLine.substring(2),
          key: `bullet-${index}`
        });
        return;
      }
      
      // Regular paragraph text
      currentSection.push({
        type: 'paragraph',
        content: trimmedLine,
        key: `para-${index}`
      });
    });
    
    if (currentSection.length > 0) {
      formattedElements.push(currentSection);
    }
    
    return formattedElements;
  };

  // Format inline text (bold, italic, etc.)
  const formatInlineText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} style={{ fontWeight: 600, color: '#1a202c' }}>
            {part.replace(/^\*\*|\*\*$/g, '')}
          </span>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <span key={index} style={{ fontStyle: 'italic' }}>
            {part.replace(/^\*|\*$/g, '')}
          </span>
        );
      }
      return part;
    });
  };

  // Render formatted content
  const renderFormattedContent = (text) => {
    const sections = formatResponse(text);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sections.map((section, sectionIndex) => {
          if (section.type === 'header') {
            return (
              <div key={section.key} style={{ marginBottom: '6px' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: 700, 
                  color: '#1976d2', 
                  marginBottom: '4px',
                  margin: 0,
                  lineHeight: 1.3,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}>
                  {section.content}
                </h3>
                <div style={{ 
                  borderBottom: '2px solid #e3f2fd', 
                  marginBottom: '6px' 
                }}></div>
              </div>
            );
          }
          
          return (
            <div key={`section-${sectionIndex}`} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {section.map((item) => {
                if (item.type === 'bullet') {
                  return (
                    <div key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: '#1976d2', fontWeight: 'bold', marginTop: '2px', fontSize: '12px' }}>•</span>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#2c2c2c', 
                        lineHeight: 1.5, 
                        flex: 1,
                        margin: 0,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                      }}>
                        {formatInlineText(item.content)}
                      </p>
                    </div>
                  );
                }
                
                if (item.type === 'paragraph') {
                  return (
                    <p key={item.key} style={{ 
                      fontSize: '14px', 
                      color: '#2c2c2c', 
                      lineHeight: 1.5,
                      margin: 0,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                    }}>
                      {formatInlineText(item.content)}
                    </p>
                  );
                }
                
                return null;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const generateGeminiResponse = async (userInput) => {
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyArjTDiaJOVP2wYoyKELb5nIuBVtXBWVoM',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a medical AI assistant. Please provide accurate and helpful information for the following medical-related question. Format your response with clear headings using **Header** format, bullet points using * format, and proper paragraph breaks for better readability: ${userInput}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'I apologize, but I encountered an error while processing your request. Please try again.';
    }
  };

  // Send message handler
  const sendMessage = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    try {
      const aiText = await generateGeminiResponse(input);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiText,
          timestamp: new Date(),
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, there was an error processing your request.',
          timestamp: new Date(),
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ 
      height: '75vh', 
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
        borderBottom: '1px solid #e2e8f0',
        flexShrink: 0
      }}>
        <div style={{ padding: '12px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#1976d2',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  AI Medical Assistant
                </h1>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#64748b', 
                  margin: '1px 0 0 0' 
                }}>
                  Your intelligent healthcare companion
                </p>
              </div>
            </div>
            
            <div style={{ minWidth: '180px' }}>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                  color: '#1e293b'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="">Select Patient</option>
                <option value="john">John Doe</option>
                <option value="jane">Jane Smith</option>
                <option value="alex">Alex Johnson</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        minHeight: 0
      }}>
        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: '12px',
                backgroundColor: msg.sender === 'ai' ? '#1976d2' : '#10b981',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                flexShrink: 0
              }}>
                {msg.sender === 'ai' ? 'AI' : 'U'}
              </div>
              
              <div style={{
                flex: 1,
                borderRadius: '12px',
                padding: '12px 16px',
                backgroundColor: msg.sender === 'ai' ? '#f8fafc' : '#1976d2',
                color: msg.sender === 'ai' ? '#1e293b' : 'white',
                border: msg.sender === 'ai' ? '2px solid #e2e8f0' : 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                maxWidth: '100%',
                wordWrap: 'break-word'
              }}>
                {msg.sender === 'ai' ? (
                  renderFormattedContent(msg.text)
                ) : (
                  <p style={{ 
                    fontSize: '14px', 
                    margin: 0, 
                    lineHeight: 1.5,
                    fontFamily: 'inherit'
                  }}>
                    {msg.text}
                  </p>
                )}
                
                <div style={{
                  fontSize: '11px',
                  marginTop: '8px',
                  textAlign: 'right',
                  opacity: 0.7,
                  fontFamily: 'inherit'
                }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#1976d2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
              }}>
                AI
              </div>
              <div style={{
                backgroundColor: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#1976d2',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out'
                    }}></div>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#1976d2',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out',
                      animationDelay: '0.16s'
                    }}></div>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#1976d2',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out',
                      animationDelay: '0.32s'
                    }}></div>
                  </div>
                  <span style={{ 
                    fontSize: '13px', 
                    color: '#64748b', 
                    marginLeft: '4px',
                    fontFamily: 'inherit'
                  }}>
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ 
          padding: '12px 16px', 
          borderTop: '2px solid #f1f5f9',
          backgroundColor: '#fafbfc',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about healthcare, symptoms, or medical conditions..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading && input.trim()) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: isLoading ? '#f8fafc' : 'white',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                color: '#1e293b',
                resize: 'none',
                height: '40px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              disabled={isLoading || !input.trim()}
              onClick={sendMessage}
              style={{
                backgroundColor: isLoading || !input.trim() ? '#94a3b8' : '#1976d2',
                color: 'white',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                boxShadow: isLoading || !input.trim() ? 'none' : '0 2px 8px rgba(25, 118, 210, 0.25)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && input.trim()) {
                  e.target.style.backgroundColor = '#1565c0';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && input.trim()) {
                  e.target.style.backgroundColor = '#1976d2';
                  e.target.style.transform = 'translateY(0px)';
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            } 40% {
              transform: scale(1);
            }
          }
          
          ::-webkit-scrollbar {
            width: 5px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f5f9;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  );
};

export default AiAssistantContent;
