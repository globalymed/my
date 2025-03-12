import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Capacitor } from '@capacitor/core';
import { ClinicCard } from './ClinicCard';
import { db } from './src/firebase';

const ClinicRecommender = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      const clinicsRef = collection(db, 'clinics');
      const q = query(
        clinicsRef,
        where('rating', '>=', 4),
        orderBy('rating', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(q);
      const clinicData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (Capacitor.isNativePlatform()) {
        const geminiCache = httpsCallable('geminiCache');
        const cachedClinics = await geminiCache({ data: clinicData });
        setClinics(cachedClinics.data);
      } else {
        setClinics(clinicData);
      }

      setLoading(false);
    };

    fetchClinics();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        clinics.map((clinic) => <ClinicCard key={clinic.id} clinic={clinic} />)
      )}
    </div>
  );
};

export default ClinicRecommender; 