
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Documents from "./pages/Documents";
import Appointments from "./pages/Appointments";
import Availability from "./pages/Availability";
import Chat from "./pages/Chat";
import Invoices from "./pages/Invoices";
import Payouts from "./pages/Payouts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
