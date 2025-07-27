import React, { useState } from "react";
import "./DoctorDashboard.css";
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  FileText,
  CreditCard,
  Users,
  Search,
  Plus,
  Phone,
  Video,
  FileIcon as FileInvoice,
  DoorOpen,
  User,
  Clock,
} from "lucide-react";
import { DashboardContent } from "./components/dashboard-content";
import { AppointmentsContent } from "./components/appointments-content";
import { PatientsContent } from "./components/patients-content";
import { DocumentsContent } from "./components/documents-content";
import { InvoicesContent } from "./components/invoices-content";
import { AvailabilityContent } from "./components/availability-content";
import { AIAssistantContent } from "./components/ai-assistant-content";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Calendar, label: "Appointments" },
  { icon: Users, label: "Patients" },
  { icon: FileText, label: "Documents" },
  { icon: CreditCard, label: "Invoices" },
  { icon: Clock, label: "Availability" },
  { icon: MessageSquare, label: "AI Assistant" },
];

const upcomingAppointments = [
  {
    id: 1,
    name: "Dr. Himanshu Patel",
    specialty: "Neurologist",
    address: "1288 Naraina, west, apt...",
    rating: 5,
    experience: "12 years",
    availability: "Yes",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Dr. Himanshu Patel",
    specialty: "Neurologist",
    address: "1288 Naraina, west, apt...",
    rating: 5,
    experience: "12 years",
    availability: "Yes",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Dr. Himanshu Patel",
    specialty: "Neurologist",
    address: "1288 Naraina, west, apt...",
    rating: 5,
    experience: "12 years",
    availability: "Yes",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "Dr. Himanshu Patel",
    specialty: "Neurologist",
    address: "1288 Naraina, west, apt...",
    rating: 5,
    experience: "12 years",
    availability: "Yes",
    image: "/placeholder.svg?height=60&width=60",
  },
];

const quickActions = [
  { icon: User, label: "New Patient", color: "bg-blue-500" },
  { icon: Calendar, label: "Schedule", color: "bg-green-500" },
  { icon: Video, label: "Video Call", color: "bg-purple-500" },
  { icon: Phone, label: "Phone Call", color: "bg-orange-500" },
  { icon: FileInvoice, label: "Generate Invoice", color: "bg-red-500" },
  { icon: DoorOpen, label: "Room Status", color: "bg-teal-500" },
];

export function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");

  return (
    <div className="doctor-dashboard">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`doctor-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: '#3b82f6',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '1rem',
                height: '1rem',
                backgroundColor: 'white',
                borderRadius: '0.125rem'
              }}></div>
            </div>
            <div>
              <h1 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#111827' }}>MedDashboard</h1>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Medical Practice</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
          <div className="space-y-2">
            {sidebarItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.label;
              return (
                <button
                  key={index}
                  className={`btn w-full ${isActive ? 'btn-secondary' : 'btn-ghost'}`}
                  style={{
                    justifyContent: 'flex-start',
                    gap: '0.75rem',
                    height: '3rem',
                    ...(isActive ? {
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      borderRight: '2px solid #2563eb'
                    } : {})
                  }}
                  onClick={() => setActiveSection(item.label)}
                >
                  <IconComponent style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              JE
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Jack Ezamde</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Doctor/Physician</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="doctor-main-content">
        {/* Header */}
        <header className="doctor-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="btn btn-ghost" 
              style={{ display: 'block' }}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activeSection}</h1>
              <p className="text-sm text-gray-500" style={{ display: window.innerWidth > 640 ? 'block' : 'none' }}>
                {activeSection === "Dashboard" && "Recent activities"}
                {activeSection === "Appointments" && "Manage your patient appointments"}
                {activeSection === "Patients" && "Manage your patient records"}
                {activeSection === "Documents" && "Manage patient documents and files"}
                {activeSection === "Invoices" && "Manage billing and payments"}
                {activeSection === "Availability" && "Manage your working hours and schedule"}
                {activeSection === "AI Assistant" && "Get medical insights and recommendations"}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
              <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              <span style={{ display: window.innerWidth > 640 ? 'inline' : 'none' }}>Health Assistant</span>
              <span style={{ display: window.innerWidth <= 640 ? 'inline' : 'none' }}>Assistant</span>
            </button>
            <div style={{ 
              display: window.innerWidth > 768 ? 'flex' : 'none',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#4b5563'
            }}>
              <Calendar style={{ width: '1rem', height: '1rem' }} />
              <span>Date</span>
              <span className="font-medium">24th October, 2025</span>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="doctor-search-bar">
          <div style={{ position: 'relative', maxWidth: '24rem' }}>
            <Search style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              width: '1rem',
              height: '1rem'
            }} />
            <input
              className="input"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {/* Dashboard Content */}
        <main className="doctor-content">
          {activeSection === "Dashboard" && <DashboardContent />}
          {activeSection === "Appointments" && <AppointmentsContent />}
          {activeSection === "Patients" && <PatientsContent />}
          {activeSection === "Documents" && <DocumentsContent />}
          {activeSection === "Invoices" && <InvoicesContent />}
          {activeSection === "Availability" && <AvailabilityContent />}
          {activeSection === "AI Assistant" && <AIAssistantContent />}
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;
