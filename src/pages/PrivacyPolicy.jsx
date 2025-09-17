import React from 'react';
import { Box, Container, Typography, Divider, Link } from '@mui/material';
import SEO from '../components/SEO.jsx';
import { structuredDataTemplates } from '../utils/structuredData.js';

const privacyContent = `
Medyatra Privacy Policy
Effective Date: July 11, 2025
Last Updated: July 11, 2025

1. Scope and Applicability
This Privacy Policy (“Policyˮ) governs the collection, use, and protection of your personal information when you access or use Medyatraʼs website, mobile application, APIs, and related services (collectively, the “Platformˮ). This Policy applies only to users located in jurisdictions where Medyatra is authorized to operate. We do not offer or market services to residents of restricted jurisdictions, including the European Union (EU), United Kingdom (UK), or Australia. If you are located in these regions, please do not use the Platform, as this Policy does not apply to you.

2. What Data We Collect
We collect the following types of data when you use the Platform:
Personal Identification Data: Name, email address, phone number, and other contact details you provide during registration or use of the Platform.
Health-Related Information: Any health data or medical information you voluntarily submit, such as when booking medical appointments or using AI-driven features.
Device and Usage Data: IP address, device ID, browser type, operating system, and usage information collected via cookies and similar technologies.
Booking and Transactional Data: Information related to appointment requests, travel bookings, and other services facilitated through the Platform.
Voluntary vs. Required Data: Some data is required to provide core Platform features (e.g., name and contact details for bookings), while other data is voluntary (e.g., health information for personalized insights). We do not engage in automatic profiling unless explicitly disclosed.

3. How We Use Your Data
We use your data for the following purposes:
To provide and improve Platform features, such as booking services and AI-driven insights.
To communicate with you, provide customer support, and send important updates.
To prevent fraud, ensure security, and comply with legal obligations.
To analyze usage patterns and improve the Platform (data is anonymized where possible).
We do not sell or monetize your personal data.

4. Lawful Basis for Processing
In accordance with Indiaʼs Digital Personal Data Protection Act (DPDP Act), we process your data based on:
Your consent, particularly for sensitive or health-related data.
Legitimate use, such as providing the services you request or ensuring Platform security.

5. Data Sharing and Disclosures
We may share your data with the following categories of third parties:
Service Providers: Hospitals, hotels, payment processors, and other partners necessary to fulfill your requests.
Cloud Storage and Analytics Providers: To store data securely and analyze Platform performance.
Legal and Governmental Authorities: When required by law or to protect our legal rights.
Third-Party Integrations: Such as APIs or email services that enhance Platform functionality.
We do not share your data with advertisers or data brokers, and we do not sell your data.

6. Data Transfers
Your data may be transferred across borders as part of our global operations. By using the Platform, you consent to such transfers. We apply safeguards, including contractual controls and secure protocols, to protect your data. Note that we have no data localization obligations outside India.

7. Data Retention
We retain your data only as long as necessary to provide the services or comply with legal obligations. Upon account deletion, we will delete or anonymize your personal data unless retention is justified for legal or operational reasons.

8. User Rights
You have the following rights regarding your data:
Access: Request a copy of your data.
Correction: Update or correct inaccuracies.
Deletion: Request deletion of your data.
Export: Request your data in a structured, machine-readable format.
To exercise these rights, contact us at contact@medyatra.space or use the account settings where available. We will respond to your request within 15 days.

9. Childrenʼs Privacy
Users under 18 must provide verifiable parental or guardian consent to use the Platform. We do not knowingly collect data from minors without such consent.

10. Security Practices
We implement industry-standard security measures, including encryption, access controls, and secure servers, to protect your data. In the event of a data breach, we will notify you and relevant authorities within legal deadlines. If you suspect a breach, please report it to contact@medyatra.space.

11. Cookies and Tracking Technologies
We use cookies and similar technologies for functional and analytics purposes. You can disable cookies through your browser settings, though this may affect Platform functionality. We honor “Do Not Trackˮ signals where applicable.

12. Restricted Jurisdictions
We do not knowingly collect data from residents of the EU, UK, or Australia. If we inadvertently collect data from these regions, it will be deleted promptly. If you are located in these jurisdictions, please exit the Platform immediately.

13. Grievance Redressal
If you have concerns about your data or this Policy, contact our interim Grievance Officer at contact@medyatra.space. We will acknowledge your complaint within 72 hours and aim to resolve it within 15 days. You may escalate unresolved issues to Indiaʼs Data Protection Board.

14. Policy Updates
We may update this Policy from time to time. Significant changes will be communicated via the Platform or email. The date of the last update will be reflected at the top of this Policy.

15. Contact Us
For questions or concerns, contact us at:
Email: contact@medyatra.space
Address: Medyatra, New Delhi, India
For more information, refer to our Terms of Service.
`;

const PrivacyPolicy = () => {
  const privacyStructuredData = [
    structuredDataTemplates.organization
  ];

  return (
    <>
      <SEO
        title="Privacy Policy - MedYatra Medical Tourism Platform"
        description="Read MedYatra's Privacy Policy to understand how we collect, use, and protect your personal information on our AI-powered medical tourism platform."
        keywords="privacy policy, MedYatra privacy, data protection, personal information, medical tourism privacy, data security"
        canonical="https://medyatra.space/privacy"
        ogTitle="Privacy Policy - MedYatra Medical Tourism Platform"
        ogDescription="MedYatra's Privacy Policy covering data collection, usage, protection, and user rights on our medical tourism platform."
        ogImage="https://medyatra.space/logo.webp"
        ogUrl="https://medyatra.space/privacy"
        structuredData={privacyStructuredData}
      />
      
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, p: { xs: 2, sm: 4 }, maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom align="center">
            Privacy Policy
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {privacyContent.split('\n').map((line, idx) =>
            line.trim().length === 0 ? <br key={idx} /> :
            line.match(/^\d+\./) ? (
              <Typography key={idx} variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                {line}
              </Typography>
            ) : (
              <Typography key={idx} variant="body1" sx={{ mb: 1 }}>
                {line}
              </Typography>
            )
          )}
        </Box>
      </Container>
    </>
  );
};

export default PrivacyPolicy; 