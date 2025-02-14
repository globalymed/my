import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const BookingConfirmationForm = ({ selectedSlot, onSubmit }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPhoneNumber(formData.phone, 'IN')) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        slotId: selectedSlot.id,
        createdAt: serverTimestamp(),
      });

      onSubmit();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
    </form>
  );
};

export default BookingConfirmationForm; 