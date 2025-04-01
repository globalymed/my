import { 
   getDoctorById, 
   getClinicById,
   getAvailability,
   createWeeklyAvailability
 } from '../firebase';
 
 /**
  * Synchronizes a doctor's availability with their associated clinics
  * 
  * @param {string} doctorId - The ID of the doctor
  * @param {string[]} clinicIds - Array of clinic IDs (optional, defaults to clinics from doctor profile)
  * @returns {object} - Result of the sync operation
  */
 export const syncDoctorWithClinicAvailability = async (doctorId, clinicIds = null) => {
   try {
     // Get doctor details
     const doctor = await getDoctorById(doctorId);
     if (!doctor) {
       throw new Error(`Doctor with ID ${doctorId} not found`);
     }
     
     // Use provided clinic IDs or get from doctor profile
     const doctorClinics = clinicIds || doctor.clinicIds || [];
     if (doctorClinics.length === 0) {
       throw new Error('No clinics associated with this doctor');
     }
     
     const results = {
       success: true,
       syncedClinics: 0,
       errors: []
     };
     
     // Process each clinic
     for (const clinicId of doctorClinics) {
       try {
         // Create default weekly schedule (M-F, 9am-5pm)
         const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday
         const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
         
         // Create weekly availability entries for each day
         for (const dayOfWeek of weekdays) {
           const slots = timeSlots.map(time => ({
             time,
             available: true,
             appointmentId: null
           }));
           
           await createWeeklyAvailability(
             doctorId,
             clinicId,
             dayOfWeek,
             slots
           );
         }
         
         results.syncedClinics++;
       } catch (error) {
         results.errors.push({
           clinicId,
           error: error.message
         });
       }
     }
     
     // Mark as failed if no clinics were synchronized
     if (results.syncedClinics === 0) {
       results.success = false;
     }
     
     return results;
   } catch (error) {
     return {
       success: false,
       error: error.message
     };
   }
 };
 
 /**
  * Checks for overlapping appointments in doctor's schedule
  * 
  * @param {string} doctorId - The ID of the doctor
  * @param {string} date - The date to check (YYYY-MM-DD format)
  * @param {string} time - The time to check (HH:MM format)
  * @param {number} duration - The duration in minutes
  * @returns {boolean} - True if the slot is available, false if overlapping
  */
 export const checkDoctorAvailability = async (doctorId, date, time, duration = 30) => {
   try {
     const doctor = await getDoctorById(doctorId);
     if (!doctor) {
       throw new Error(`Doctor with ID ${doctorId} not found`);
     }
     
     // Get doctor's availability for this date
     const clinicIds = doctor.clinicIds || [];
     let isAvailable = false;
     
     for (const clinicId of clinicIds) {
       const availabilityList = await getAvailability(clinicId, date);
       
       for (const availability of availabilityList) {
         // Check if this availability belongs to the doctor
         if (availability.doctorId === doctorId) {
           // Find the specific time slot
           const slot = availability.slots.find(s => s.time === time);
           if (slot && slot.available) {
             isAvailable = true;
             break;
           }
         }
       }
       
       if (isAvailable) break;
     }
     
     return isAvailable;
   } catch (error) {
     console.error('Error checking doctor availability:', error);
     return false;
   }
 };
 
 /**
  * Collects and formats patient appointment history for a doctor
  * 
  * @param {string} doctorId - The ID of the doctor
  * @param {string} patientId - The ID of the patient
  * @returns {object[]} - Array of appointment history items
  */
 export const getFormattedPatientHistory = async (doctorId, patientId) => {
   try {
     // This is a placeholder - you'll need to implement the actual logic
     // to fetch and format the patient's appointment history with this doctor
     return [];
   } catch (error) {
     console.error('Error getting patient history:', error);
     return [];
   }
 };
 
 /**
  * Calculates doctor analytics (appointments stats, patient stats, etc.)
  * 
  * @param {string} doctorId - The ID of the doctor
  * @param {string} startDate - Start date in YYYY-MM-DD format
  * @param {string} endDate - End date in YYYY-MM-DD format
  * @returns {object} - Doctor analytics data
  */
 export const getDoctorAnalytics = async (doctorId, startDate, endDate) => {
   try {
     // This is a placeholder - you'll need to implement the actual logic
     // to calculate doctor analytics
     return {
       totalAppointments: 0,
       completedAppointments: 0,
       cancelledAppointments: 0,
       newPatients: 0,
       returnPatients: 0,
       averageDuration: 0
     };
   } catch (error) {
     console.error('Error getting doctor analytics:', error);
     return null;
   }
 }; 