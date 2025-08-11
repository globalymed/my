import {
    Box,
} from '@mui/material';

import TreatmentHeroSection from './components/ivfComponents/HeroSection';
import AdvanceTreatmentSection from './components/ivfComponents/AdvanceTreatmentSection';
import GlobalTreatmentSection from './components/ivfComponents/GlobalTreatmentSection';
import FAQTreatmentSection from './components/ivfComponents/FAQTreatmentSection';
import FinalCTATreatmentSecion from './components/ivfComponents/FinalCTATreatmentSection';
import WorkingTreatmentSection from './components/ivfComponents/WorkingTreatmentSection';
import TopClinicsTreatmentSection from './components/ivfComponents/TopClinicsTreatmentSection';
import TransformationTreatmentSection from './components/ivfComponents/TransformationTreatmentSection';
import SuccessStoriesTreatmentSection from './components/ivfComponents/SuccessStoriesTreatmentSection';
import ReviewsTreatmentSecion from './components/ivfComponents/ReviewsTreatmentSection';
import TravelSupportTreatmentSection from './components/ivfComponents/TravelSupportTreatmentSection';
import LatestBlogTreatmentSection from './components/ivfComponents/LatestBlogTreatmentSection';


const IVFTreatment = () => {

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
      {/* <TransformationTreatmentSection /> */}

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

export default IVFTreatment