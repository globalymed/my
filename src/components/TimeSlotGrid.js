import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';

const TimeSlotGrid = ({ selectedDate }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const slotsRef = collection(db, 'slots');
      const q = query(
        slotsRef,
        where('date', '==', dateStr),
        where('available', '==', true)
      );

      const snapshot = await getDocs(q);
      const slotData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSlots(slotData);
    };

    fetchSlots();
  }, [selectedDate]);

  return (
    <div>
      {slots.map((slot) => (
        <div key={slot.id}>{slot.time}</div>
      ))}
    </div>
  );
};

export default TimeSlotGrid; 