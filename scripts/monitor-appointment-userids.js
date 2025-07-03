// scripts/monitor-appointment-userids.js
// Script to monitor and verify appointment-user relationships over time

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load environment variables first
require('dotenv').config();

// Check if service account file exists (fallback option)
const serviceAccountPath = path.join(__dirname, '../testUpdatingMissingParaDb/serviceAccountKey.json');
const hasServiceAccountFile = fs.existsSync(serviceAccountPath);
const hasEnvCredentials = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY);

if (!hasServiceAccountFile && !hasEnvCredentials) {
  console.error('Firebase credentials not found!');
  console.error('Please provide either:');
  console.error('1. Service account file at:', serviceAccountPath);
  console.error('2. Environment variables: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, etc.');
  process.exit(1);
}

// Initialize Firebase Admin SDK
try {
  const serviceAccount = hasEnvCredentials ? {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI
  } : require('../testUpdatingMissingParaDb/serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
  process.exit(1);
}

const db = admin.firestore();

// Helper function to get a user by ID
async function getUserById(userId) {
  try {
    const userDocRef = db.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();
    
    if (userDocSnap.exists) {
      return {
        id: userId,
        ...userDocSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting user with ID ${userId}:`, error);
    return null;
  }
}

// Function to generate a summary report for all appointments
async function generateAppointmentUsersReport() {
  try {
    console.log('Generating appointment-user relationship report...');
    
    const stats = {
      totalAppointments: 0,
      validRelationships: 0,
      invalidRelationships: 0,
      missingUserId: 0,
      userNotFound: 0,
      emailMismatch: 0,
      detailedIssues: []
    };
    
    // Get all appointments
    const appointmentsSnapshot = await db.collection('appointments').get();
    stats.totalAppointments = appointmentsSnapshot.size;
    
    console.log(`Found ${stats.totalAppointments} appointments to analyze...`);
    
    // Process each appointment
    for (const appointmentDoc of appointmentsSnapshot.docs) {
      const appointmentId = appointmentDoc.id;
      const appointment = appointmentDoc.data();
      
      // Check if appointment has userId
      if (!appointment.userId) {
        stats.missingUserId++;
        stats.invalidRelationships++;
        stats.detailedIssues.push({
          appointmentId,
          issue: 'Missing userId',
          patientEmail: appointment.patientEmail || 'unknown'
        });
        continue;
      }
      
      // Get the user
      const user = await getUserById(appointment.userId);
      
      // Check if user exists
      if (!user) {
        stats.userNotFound++;
        stats.invalidRelationships++;
        stats.detailedIssues.push({
          appointmentId,
          issue: 'User not found',
          userId: appointment.userId,
          patientEmail: appointment.patientEmail || 'unknown'
        });
        continue;
      }
      
      // Check email match if available
      if (appointment.patientEmail && user.email && appointment.patientEmail !== user.email) {
        stats.emailMismatch++;
        stats.invalidRelationships++;
        stats.detailedIssues.push({
          appointmentId,
          issue: 'Email mismatch',
          userId: appointment.userId,
          appointmentEmail: appointment.patientEmail,
          userEmail: user.email
        });
        continue;
      }
      
      // If we get here, the relationship is valid
      stats.validRelationships++;
    }
    
    // Calculate percentages
    const validPercentage = (stats.validRelationships / stats.totalAppointments * 100).toFixed(2);
    const invalidPercentage = (stats.invalidRelationships / stats.totalAppointments * 100).toFixed(2);
    
    // Generate report
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalAppointments: stats.totalAppointments,
        validRelationships: stats.validRelationships,
        validPercentage: `${validPercentage}%`,
        invalidRelationships: stats.invalidRelationships,
        invalidPercentage: `${invalidPercentage}%`
      },
      issues: {
        missingUserId: stats.missingUserId,
        userNotFound: stats.userNotFound,
        emailMismatch: stats.emailMismatch,
      },
      detailedIssues: stats.detailedIssues
    };
    
    // Print summary
    console.log('\n====== APPOINTMENT-USER RELATIONSHIP REPORT ======');
    console.log(`Generated at: ${report.generatedAt}`);
    console.log('\nSUMMARY:');
    console.log(`Total appointments: ${report.summary.totalAppointments}`);
    console.log(`Valid relationships: ${report.summary.validRelationships} (${report.summary.validPercentage})`);
    console.log(`Invalid relationships: ${report.summary.invalidRelationships} (${report.summary.invalidPercentage})`);
    
    console.log('\nISSUES:');
    console.log(`Missing userId: ${report.issues.missingUserId}`);
    console.log(`User not found: ${report.issues.userNotFound}`);
    console.log(`Email mismatch: ${report.issues.emailMismatch}`);
    
    // Print detailed issues if any
    if (stats.detailedIssues.length > 0) {
      console.log('\nDETAILED ISSUES:');
      stats.detailedIssues.forEach((issue, index) => {
        console.log(`\n${index + 1}. Appointment ID: ${issue.appointmentId}`);
        console.log(`   Issue: ${issue.issue}`);
        
        // Print relevant details based on issue type
        if (issue.userId) console.log(`   User ID: ${issue.userId}`);
        if (issue.patientEmail) console.log(`   Patient Email: ${issue.patientEmail}`);
        if (issue.appointmentEmail) console.log(`   Appointment Email: ${issue.appointmentEmail}`);
        if (issue.userEmail) console.log(`   User Email: ${issue.userEmail}`);
      });
    }
    
    // Save report to file
    const reportFilename = `appointment-user-report-${new Date().toISOString().replace(/:/g, '-')}.json`;
    const reportPath = path.join(__dirname, '../logs', reportFilename);
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../logs'))) {
      fs.mkdirSync(path.join(__dirname, '../logs'));
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${reportPath}`);
    
    return report;
  } catch (error) {
    console.error('Error generating appointment-user relationship report:', error);
    throw error;
  }
}

// Function to monitor appointments created within a specific time range
async function monitorRecentAppointments(daysBack = 7) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const startTimestamp = admin.firestore.Timestamp.fromDate(startDate);
    
    console.log(`Monitoring appointments created in the last ${daysBack} days (since ${startDate.toISOString()})...`);
    
    // Query for recent appointments
    const appointmentsSnapshot = await db.collection('appointments')
      .where('createdAt', '>=', startTimestamp)
      .get();
    
    const totalAppointments = appointmentsSnapshot.size;
    console.log(`Found ${totalAppointments} recent appointments`);
    
    // Track statistics
    const stats = {
      total: totalAppointments,
      valid: 0,
      issues: 0,
      details: []
    };
    
    // Process each appointment
    for (const appointmentDoc of appointmentsSnapshot.docs) {
      const appointmentId = appointmentDoc.id;
      const appointment = appointmentDoc.data();
      
      // Get created date in readable format
      const createdDate = appointment.createdAt && appointment.createdAt.toDate 
        ? appointment.createdAt.toDate().toISOString() 
        : 'unknown';
      
      console.log(`\nChecking appointment ${appointmentId} created at ${createdDate}`);
      
      // Basic validation
      let valid = true;
      const issues = [];
      
      // Check userId
      if (!appointment.userId) {
        valid = false;
        issues.push('Missing userId');
      } else {
        console.log(`Appointment has userId: ${appointment.userId}`);
        
        // Get the user
        const user = await getUserById(appointment.userId);
        
        if (!user) {
          valid = false;
          issues.push(`User with ID ${appointment.userId} not found`);
        } else {
          console.log(`Found matching user: ${user.firstName} ${user.lastName} (${user.email})`);
          
          // Check email match
          if (appointment.patientEmail && user.email && appointment.patientEmail !== user.email) {
            valid = false;
            issues.push(`Email mismatch: appointment email (${appointment.patientEmail}) doesn't match user email (${user.email})`);
          }
        }
      }
      
      // Update stats
      if (valid) {
        stats.valid++;
        console.log(`✅ Appointment ${appointmentId} is valid`);
      } else {
        stats.issues++;
        console.log(`❌ Appointment ${appointmentId} has issues: ${issues.join(', ')}`);
        
        stats.details.push({
          appointmentId,
          createdAt: createdDate,
          issues,
          appointment: {
            userId: appointment.userId,
            patientEmail: appointment.patientEmail,
            patientName: appointment.patientName,
            treatmentType: appointment.treatmentType,
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime,
            clinicName: appointment.clinicName
          }
        });
      }
    }
    
    // Generate summary
    console.log('\n====== RECENT APPOINTMENTS MONITORING REPORT ======');
    console.log(`Time period: Last ${daysBack} days (since ${startDate.toISOString()})`);
    console.log(`Total appointments: ${stats.total}`);
    console.log(`Valid appointments: ${stats.valid} (${(stats.valid/stats.total*100).toFixed(2)}%)`);
    console.log(`Appointments with issues: ${stats.issues} (${(stats.issues/stats.total*100).toFixed(2)}%)`);
    
    if (stats.issues > 0) {
      console.log('\nDETAILED ISSUES:');
      stats.details.forEach((detail, index) => {
        console.log(`\n${index + 1}. Appointment ID: ${detail.appointmentId}`);
        console.log(`   Created at: ${detail.createdAt}`);
        console.log(`   Issues: ${detail.issues.join(', ')}`);
        console.log(`   Patient: ${detail.appointment.patientName} (${detail.appointment.patientEmail})`);
        console.log(`   User ID: ${detail.appointment.userId}`);
        console.log(`   Treatment: ${detail.appointment.treatmentType}`);
        console.log(`   Appointment: ${detail.appointment.appointmentDate} at ${detail.appointment.appointmentTime}`);
        console.log(`   Clinic: ${detail.appointment.clinicName}`);
      });
    }
    
    return stats;
  } catch (error) {
    console.error('Error monitoring recent appointments:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.includes('--report')) {
      // Generate full report
      await generateAppointmentUsersReport();
    } else if (args.includes('--monitor')) {
      // Monitor recent appointments
      const daysOption = args.find(arg => arg.startsWith('--days='));
      const days = daysOption ? parseInt(daysOption.split('=')[1]) : 7;
      await monitorRecentAppointments(days);
    } else {
      // Print usage
      console.log('Usage:');
      console.log('  node monitor-appointment-userids.js --report        # Generate full appointment-user relationship report');
      console.log('  node monitor-appointment-userids.js --monitor       # Monitor recent appointments (default: last 7 days)');
      console.log('  node monitor-appointment-userids.js --monitor --days=14  # Monitor appointments from last 14 days');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
