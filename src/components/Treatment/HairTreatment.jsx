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


const HairTreatment = () => {
  return (
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
  );
}

export default HairTreatment;