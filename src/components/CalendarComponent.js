import React, { useState, useEffect } from 'react';
import { addDays, format, isBefore, isAfter } from 'date-fns';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { getFirestore, runTransaction, doc } from 'firebase/firestore';
import { db } from '../firebase';

const CalendarComponent = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isDateValid = (date) => {
    const today = new Date();
    const maxDate = addDays(today, 30);
    return !isBefore(date, today) && !isAfter(date, maxDate);
  };

  const handleDateChange = (date) => {
    if (isDateValid(date)) {
      setSelectedDate(date);
      onSelectDate(date);
    }
  };

  return (
    <div>
      {Array.from({ length: 7 }).map((_, index) => {
        const day = addDays(selectedDate, index);
        return (
          <button
            key={index}
            disabled={!isDateValid(day)}
            onClick={() => handleDateChange(day)}
          >
            {format(day, 'yyyy-MM-dd')}
          </button>
        );
      })}
    </div>
  );
};

const BookingConfirmationForm = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    reason: '',
    insurance: false,
    insuranceDetails: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({ ...prevData, [name]: fieldValue }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate required fields for step 1
      if (!formData.fullName || !formData.phone || !isValidPhoneNumber(formData.phone, 'IN')) {
        // Display error message or handle validation failure
        return;
      }
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <>
          <TextField
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <TextField
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Button onClick={handleNext}>Next</Button>
        </>
      )}
      {step === 2 && (
        <>
          <TextField
            name="reason"
            label="Reason for Visit"
            value={formData.reason}
            onChange={handleChange}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                name="insurance"
                checked={formData.insurance}
                onChange={handleChange}
              />
            }
            label="I have insurance"
          />
          {formData.insurance && (
            <TextField
              name="insuranceDetails"
              label="Insurance Details"
              value={formData.insuranceDetails}
              onChange={handleChange}
            />
          )}
          <Button type="submit">Confirm Booking</Button>
        </>
      )}
    </form>
  );
};

const reserveSlot = async (slotId, userId) => {
  try {
    await runTransaction(db, async (transaction) => {
      const slotRef = doc(db, 'slots', slotId);
      const slotDoc = await transaction.get(slotRef);
      
      if (!slotDoc.exists()) {
        throw new Error('Slot document does not exist');
      }

      if (slotDoc.data().status !== 'available') {
        throw new Error('Slot is already booked');
      }

      transaction.update(slotRef, { 
        status: 'booked',
        bookedBy: userId,
        bookedAt: new Date(),
      });
    });
    console.log('Slot reserved successfully');
  } catch (error) {
    console.error('Error reserving slot:', error);
    throw error;
  }
};

export default CalendarComponent; 