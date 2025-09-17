import {
  Box,
} from '@mui/material';

import TreatmentHeroSection from './components/hairComponents/HeroSection';
import AdvanceTreatmentSection from './components/hairComponents/AdvanceTreatmentSection';
import GlobalTreatmentSection from './components/hairComponents/GlobalTreatmentSection';
import FAQTreatmentSection from './components/hairComponents/FAQTreatmentSection';
import FinalCTATreatmentSecion from './components/hairComponents/FinalCTATreatmentSection';
import WorkingTreatmentSection from './components/hairComponents/WorkingTreatmentSection';
import TopClinicsTreatmentSection from './components/hairComponents/TopClinicsTreatmentSection';
import TransformationTreatmentSection from './components/hairComponents/TransformationTreatmentSection';
import SuccessStoriesTreatmentSection from './components/hairComponents/SuccessStoriesTreatmentSection';
import ReviewsTreatmentSecion from './components/hairComponents/ReviewsTreatmentSection';
import TravelSupportTreatmentSection from './components/hairComponents/TravelSupportTreatmentSection';
import LatestBlogTreatmentSection from './components/hairComponents/LatestBlogTreatmentSection';
import SEO from '../SEO.jsx';
import { structuredDataTemplates } from '../../utils/structuredData.js';


const HairTreatment = () => {
  const hairStructuredData = [
    structuredDataTemplates.service(
      "Hair Transplant in India", 
      "Advanced hair restoration procedures including FUE, FUT, PRP therapy, and hair transplant surgery with world-renowned hair transplant specialists and state-of-the-art facilities.",
      "https://medyatra.space/treatment/hair"
    ),
    structuredDataTemplates.medicalOrganization
  ];

  return (
    <>
      <SEO
        title="Hair Transplant in India - Advanced Hair Restoration Services"
        description="Get world-class hair transplant treatment in India with FUE, FUT, PRP therapy, and advanced hair restoration procedures. Book appointments with top hair transplant specialists."
        keywords="hair transplant India, FUE hair transplant India, FUT hair transplant India, PRP therapy India, hair restoration India, hair transplant cost India, hair transplant clinic India"
        canonical="https://medyatra.space/treatment/hair"
        ogTitle="Hair Transplant in India - Advanced Hair Restoration Services"
        ogDescription="World-class hair transplant treatments in India with FUE, FUT, and PRP therapy. Get natural-looking results with experienced hair transplant specialists."
        ogImage="https://medyatra.space/hair/hair.webp"
        ogUrl="https://medyatra.space/treatment/hair"
        structuredData={hairStructuredData}
      />
      
      <Box sx={{ bgcolor: 'white', overflow: 'hidden' }}>
        {/* Hero Section */}
        <TreatmentHeroSection />

        {/* Common Dental Treatments Section */}
        <AdvanceTreatmentSection />

        {/* Why India Section */}
        <GlobalTreatmentSection />

        {/* Medyatra Working Section */}
        <WorkingTreatmentSection />

        {/* Top Clinic Section */}
        <TopClinicsTreatmentSection />

        {/* Transformation */}
        <TransformationTreatmentSection />

        {/* Success Stories */}
        <SuccessStoriesTreatmentSection />

        {/* Reviews and Testinomials */}
        {/* <ReviewsTreatmentSecion /> */}

        {/* Travel & Accommodation Support */}
        {/* <TravelSupportTreatmentSection /> */}

        {/* Latest Blog Section */}
        {/* <LatestBlogTreatmentSection /> */}

        {/* FAQs Section */}
        <FAQTreatmentSection />

        {/* Final CTA Section */}
        <FinalCTATreatmentSecion />
      </Box>
    </>
  );
}

export default HairTreatment;