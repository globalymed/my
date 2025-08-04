import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, FileText, User } from "lucide-react";
import { getAppointments, getAppointmentsByClinicIds, getTotalDocumentsCount } from "../../../firebase";

export function DashboardContent({ doctor }) {
  const [totalPatients, setTotalPatients] = useState(0);
  const [todaysAppointments, setTodaysAppointments] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);

  // Function to count unique patient emails from appointments
  const fetchTotalPatients = async () => {
    try {
      let appointments;
      
      console.log('Doctor data in dashboard:', doctor);
      console.log('Doctor clinic IDs:', doctor?.clinicIds);
      
      // If doctor has clinic IDs, filter appointments by those clinics
      if (doctor && doctor.clinicIds && doctor.clinicIds.length > 0) {
        console.log('Fetching appointments for clinic IDs:', doctor.clinicIds);
        appointments = await getAppointmentsByClinicIds(doctor.clinicIds);
        console.log('Filtered appointments:', appointments);
      } else {
        console.log('No clinic IDs found, fetching all appointments');
        // Fallback to all appointments if no clinic IDs available
        appointments = await getAppointments();
        console.log('All appointments:', appointments);
      }
      
      // Extract unique patient emails
      const uniqueEmails = new Set();
      appointments.forEach(appointment => {
        if (appointment.patientEmail) {
          uniqueEmails.add(appointment.patientEmail.toLowerCase().trim());
        }
      });
      
      console.log('Unique patient emails:', Array.from(uniqueEmails));
      console.log('Total unique patients:', uniqueEmails.size);
      setTotalPatients(uniqueEmails.size);
    } catch (error) {
      console.error('Error fetching total patients:', error);
      setTotalPatients(0);
    }
  };

  // Function to count today's appointments
  const fetchTodaysAppointments = async () => {
    try {
      let appointments;
      
      // If doctor has clinic IDs, filter appointments by those clinics
      if (doctor && doctor.clinicIds && doctor.clinicIds.length > 0) {
        appointments = await getAppointmentsByClinicIds(doctor.clinicIds);
      } else {
        // Fallback to all appointments if no clinic IDs available
        appointments = await getAppointments();
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999); // Set to end of today
      
      const todaysCount = appointments.filter(appointment => {
        if (!appointment.appointmentDate) return false;
        
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate >= today && appointmentDate <= todayEnd;
      }).length;
      
      console.log('Today\'s appointments count:', todaysCount);
      setTodaysAppointments(todaysCount);
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      setTodaysAppointments(0);
    }
  };

  // Function to fetch total documents from Firebase Storage
  const fetchTotalDocuments = async () => {
    try {
      const count = await getTotalDocumentsCount();
      setTotalDocuments(count);
    } catch (error) {
      console.error('Error fetching total documents:', error);
      setTotalDocuments(0);
    }
  };

  // Fetch all data on component mount and when doctor changes
  useEffect(() => {
    fetchTotalPatients();
    fetchTodaysAppointments();
    fetchTotalDocuments();
  }, [doctor]); // Re-fetch when doctor data changes
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
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalPatients}</div>
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
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{todaysAppointments}</div>
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
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Documents</h3>
            <FileText style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalDocuments}</div>
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
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$0</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              <span style={{ color: '#FF0000' }}>-500%</span> less than last month
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
