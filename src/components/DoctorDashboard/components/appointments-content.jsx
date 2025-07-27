import React, { useState } from "react";
import { Calendar, Clock, Plus, Search, Filter, MoreHorizontal, Phone, Video, MessageSquare } from "lucide-react";

const appointments = [
  {
    id: 1,
    patient: "John Smith",
    time: "09:00 AM",
    date: "Today",
    type: "Consultation",
    status: "confirmed",
    duration: "30 min",
    reason: "Regular checkup",
  },
  {
    id: 2,
    patient: "Sarah Johnson",
    time: "10:30 AM",
    date: "Today",
    type: "Follow-up",
    status: "pending",
    duration: "15 min",
    reason: "Blood pressure monitoring",
  },
  {
    id: 3,
    patient: "Mike Wilson",
    time: "02:00 PM",
    date: "Tomorrow",
    type: "Consultation",
    status: "confirmed",
    duration: "45 min",
    reason: "Diabetes consultation",
  },
  {
    id: 4,
    patient: "Emily Davis",
    time: "03:30 PM",
    date: "Tomorrow",
    type: "Emergency",
    status: "urgent",
    duration: "60 min",
    reason: "Chest pain evaluation",
  },
];

export function AppointmentsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return { backgroundColor: "#dcfce7", color: "#166534" };
      case "pending":
        return { backgroundColor: "#fef3c7", color: "#92400e" };
      case "urgent":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Appointments</h2>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0' }}>Manage your patient appointments</p>
        </div>
        <button style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }}>
          <Plus style={{ width: '1rem', height: '1rem' }} />
          New Appointment
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Today's Appointments</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0 0 0' }}>8</p>
            </div>
            <Calendar style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Pending</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0 0 0' }}>3</p>
            </div>
            <Clock style={{ width: '2rem', height: '2rem', color: '#eab308' }} />
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Completed</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0 0 0' }}>12</p>
            </div>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: '#16a34a',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '0.875rem' }}>✓</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Cancelled</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0 0 0' }}>2</p>
            </div>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: '#dc2626',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '0.875rem' }}>✕</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '1rem',
            height: '1rem',
            color: '#6b7280'
          }} />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 1rem 0.5rem 2.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>
        <button style={{
          padding: '0.5rem 1rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }}>
          <Filter style={{ width: '1rem', height: '1rem' }} />
          Filter
        </button>
      </div>

      {/* Appointments Tabs */}
      <div style={{ width: '100%' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          backgroundColor: '#f3f4f6', 
          padding: '0.25rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          {["all", "today", "upcoming", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                textTransform: 'capitalize',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? '#111827' : '#6b7280',
                boxShadow: activeTab === tab ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "all" && (
            <div className="card">
              <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>All Appointments</h3>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        transition: 'background-color 0.2s',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {appointment.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 style={{ fontWeight: '500', margin: 0 }}>{appointment.patient}</h4>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0' }}>{appointment.reason}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '0.125rem 0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white'
                            }}>
                              {appointment.type}
                            </span>
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '0.375rem',
                              ...getStatusColor(appointment.status)
                            }}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: '500', margin: 0 }}>{appointment.time}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0' }}>{appointment.date}</p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{appointment.duration}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          backgroundColor: 'white',
                          cursor: 'pointer'
                        }}>
                          <Phone style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <button style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          backgroundColor: 'white',
                          cursor: 'pointer'
                        }}>
                          <Video style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <button style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          backgroundColor: 'white',
                          cursor: 'pointer'
                        }}>
                          <MessageSquare style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <button style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          backgroundColor: 'white',
                          cursor: 'pointer'
                        }}>
                          <MoreHorizontal style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "today" && (
            <div className="card">
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Today's Appointments</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Today's appointments will be displayed here.</p>
              </div>
            </div>
          )}

          {activeTab === "upcoming" && (
            <div className="card">
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Upcoming Appointments</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Upcoming appointments will be displayed here.</p>
              </div>
            </div>
          )}

          {activeTab === "completed" && (
            <div className="card">
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Completed Appointments</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Completed appointments will be displayed here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
