const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

exports.createDoctor = functions.https.onCall(async (data, context) => {
    try {
        // Validate required fields
        const requiredFields = [
            'fullName',
            'email',
            'phone',
            'registrationNumber',
            'hospitalName',
            'specialization',
            'password'
        ];

        for (const field of requiredFields) {
            if (!data[field]) {
                throw new functions.https.HttpsError(
                    'invalid-argument',
                    `Missing required field: ${field}`
                );
            }
        }

        // Split full name into first and last name
        const nameParts = data.fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        // Create doctor document in Firestore
        const doctorData = {
            firstName,
            lastName,
            email: data.email.toLowerCase(),
            phone: data.phone,
            registrationNumber: data.registrationNumber,
            hospitalName: data.hospitalName,
            specialization: data.specialization,
            certificationUploaded: data.certificationUploaded || false,
            status: 'pending', // pending, approved, rejected
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Create auth user
        const userRecord = await admin.auth().createUser({
            email: data.email,
            password: data.password,
            displayName: `${firstName} ${lastName}`,
            disabled: false // Account is enabled but needs admin approval
        });

        // Add custom claims to identify as doctor
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: 'doctor',
            status: 'pending'
        });

        // Add doctor's UID to the document
        doctorData.uid = userRecord.uid;

        // Create the doctor document in Firestore
        const docRef = await admin.firestore().collection('doctors').add(doctorData);

        // Return success response
        return {
            success: true,
            doctorId: docRef.id,
            uid: userRecord.uid,
            message: 'Doctor account created successfully and pending approval'
        };

    } catch (error) {
        console.error('Error creating doctor:', error);
        
        // Handle specific error cases
        if (error.code === 'auth/email-already-exists') {
            throw new functions.https.HttpsError(
                'already-exists',
                'An account with this email already exists'
            );
        }
        
        if (error.code === 'auth/invalid-email') {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'The email address is not valid'
            );
        }

        if (error.code === 'auth/weak-password') {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Password should be at least 6 characters'
            );
        }

        // Log detailed error information
        console.error('Detailed error:', {
            code: error.code,
            message: error.message,
            details: error.details
        });

        throw new functions.https.HttpsError(
            'internal',
            'An error occurred during registration. Please try again later.'
        );
    }
});
