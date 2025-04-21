import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, User, AlertCircle, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PatientFocusButton from "@/components/ui/patient-focus-button";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { geminiAI } from "@/utils/geminiAI";
import { Textarea } from "@/components/ui/textarea";

const patients = [
  {
    id: "p1",
    name: "John Smith",
    initials: "JS",
  },
  {
    id: "p2",
    name: "Emily Johnson",
    initials: "EJ",
  },
  {
    id: "p3",
    name: "Michael Brown",
    initials: "MB",
  },
  {
    id: "p4",
    name: "Sarah Wilson",
    initials: "SW",
  },
  {
    id: "p5",
    name: "Robert Davis",
    initials: "RD",
  },
];

type MessageType = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

const Chat = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome",
      content: "Hello, I'm your AI assistant. How can I help you today? You can ask me about your patients, appointments, or medical information.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [useTextarea, setUseTextarea] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const patientId = queryParams.get("patientId");
    
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setSelectedPatient(patient);
        
        const aiMessage = {
          id: `ai-context-${Date.now()}`,
          content: `I've focused on ${patient.name}. I'll provide information specific to this patient. What would you like to know about their documents or medical history?`,
          sender: "ai" as const,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    }
  }, [location.search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user" as const,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const patientContext = selectedPatient ? selectedPatient.name : undefined;
      const response = await geminiAI.getResponse(inputValue, patientContext);

      const aiMessage = {
        id: `ai-${Date.now()}`,
        content: response,
        sender: "ai" as const,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: "ai" as const,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !useTextarea) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === "Enter" && e.shiftKey && !useTextarea) {
      setUseTextarea(true);
    }
  };

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId) || null;
    setSelectedPatient(patient);
    
    if (patient) {
      geminiAI.clearHistory();
      
      const aiMessage = {
        id: `ai-focus-${Date.now()}`,
        content: `I've focused on ${patient.name}. I'll provide information specific to this patient. What would you like to know?`,
        sender: "ai" as const,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const clearPatientFocus = () => {
    setSelectedPatient(null);
    geminiAI.clearHistory();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-9rem)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center">
            <Bot className="h-6 w-6 mr-2 text-doctor-600" />
            <h1 className="text-2xl font-semibold">AI Assistant</h1>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {selectedPatient ? (
              <PatientFocusButton 
                patient={selectedPatient} 
                onClear={clearPatientFocus} 
                className="flex-1 sm:flex-none"
              />
            ) : (
              <div className="w-full sm:w-[240px]">
                <Select onValueChange={handlePatientChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Focus on a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        
        <Card className="flex-1 mb-4 overflow-hidden flex flex-col">
          <CardContent className="p-4 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 transition-opacity animate-slide-up",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage src="/placeholder.svg" alt="AI Assistant" />
                      <AvatarFallback className="bg-doctor-100 text-doctor-800">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={cn(
                      "rounded-lg p-3 max-w-[80%]",
                      message.sender === "user"
                        ? "bg-doctor-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div
                      className={cn(
                        "text-xs mt-1",
                        message.sender === "user" ? "text-doctor-100" : "text-gray-500"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage src="/placeholder.svg" alt="Doctor" />
                      <AvatarFallback className="bg-doctor-100 text-doctor-800">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarFallback className="bg-doctor-100 text-doctor-800">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-doctor-500" />
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>
        
        <div className="relative">
          {selectedPatient && (
            <div className="absolute -top-10 left-0 right-0 bg-doctor-50 rounded-t-lg py-1.5 px-3 text-xs text-doctor-800 flex items-center border border-doctor-100 border-b-0">
              <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-doctor-500" />
              <span>Providing focused information for {selectedPatient.name}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {useTextarea ? (
              <Textarea
                placeholder={`${selectedPatient ? `Ask about ${selectedPatient.name}...` : "Ask a question..."}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 min-h-[80px]"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            ) : (
              <Input
                placeholder={`${selectedPatient ? `Ask about ${selectedPatient.name}...` : "Ask a question..."}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                disabled={isLoading}
              />
            )}
            {useTextarea && (
              <Button
                type="button"
                variant="outline"
                className="hover:bg-gray-100"
                onClick={() => setUseTextarea(false)}
                disabled={isLoading}
              >
                <span className="sr-only">Switch to single line</span>
                <span>↩️</span>
              </Button>
            )}
            <Button
              type="button"
              className="bg-doctor-500 hover:bg-doctor-600"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          {useTextarea && (
            <div className="mt-1 text-xs text-muted-foreground">
              Press Ctrl+Enter to send
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
