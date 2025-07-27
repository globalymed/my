import React from "react";
import { Calendar, DollarSign, FileText, User } from "lucide-react";

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="card" style={{ transition: 'box-shadow 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Patient</h3>
            <User style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>15</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              <span style={{ color: '#059669' }}>+7.5%</span> more than last month
            </div>
            <div style={{
              width: '100%',
              height: '0.5rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '0.25rem',
              marginTop: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '65%',
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: '0.25rem'
              }}></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500' }}>Today's Appointment</h3>
            <Calendar style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>01</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              <span style={{ color: '#059669' }}>+7.5%</span> more than last week
            </div>
            <div style={{
              width: '100%',
              height: '0.5rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '0.25rem',
              marginTop: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: '0.25rem'
              }}></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500' }}>New Documents</h3>
            <FileText style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>11</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              <span style={{ color: '#059669' }}>+7.5%</span> more than last week
            </div>
            <div style={{
              width: '100%',
              height: '0.5rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '0.25rem',
              marginTop: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '33%',
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: '0.25rem'
              }}></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500' }}>Revenue</h3>
            <DollarSign style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$900</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              <span style={{ color: '#059669' }}>+8%</span> more than last month
            </div>
            <div style={{
              width: '100%',
              height: '0.5rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '0.25rem',
              marginTop: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '8%',
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: '0.25rem'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of dashboard content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div>
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  backgroundColor: '#f9fafb' 
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    P{i}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>Patient appointment scheduled</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Stats</h3>
            <div className="space-y-4">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem' }}>Pending Appointments</span>
                <span style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem'
                }}>3</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem' }}>Completed Today</span>
                <span style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem'
                }}>8</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem' }}>Cancelled</span>
                <span style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem'
                }}>1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
