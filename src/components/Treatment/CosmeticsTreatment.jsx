import {
    Box,
} from '@mui/material';

import TreatmentHeroSection from './components/cosmeticsComponents/HeroSection';
import AdvanceTreatmentSection from './components/cosmeticsComponents/AdvanceTreatmentSection';
import GlobalTreatmentSection from './components/cosmeticsComponents/GlobalTreatmentSection';
import FAQTreatmentSection from './components/cosmeticsComponents/FAQTreatmentSection';
import FinalCTATreatmentSecion from './components/cosmeticsComponents/FinalCTATreatmentSection';
import WorkingTreatmentSection from './components/cosmeticsComponents/WorkingTreatmentSection';
import TopClinicsTreatmentSection from './components/cosmeticsComponents/TopClinicsTreatmentSection';
import TransformationTreatmentSection from './components/cosmeticsComponents/TransformationTreatmentSection';
import SuccessStoriesTreatmentSection from './components/cosmeticsComponents/SuccessStoriesTreatmentSection';
import ReviewsTreatmentSecion from './components/cosmeticsComponents/ReviewsTreatmentSection';
import TravelSupportTreatmentSection from './components/cosmeticsComponents/TravelSupportTreatmentSection';
import LatestBlogTreatmentSection from './components/cosmeticsComponents/LatestBlogTreatmentSection';


const CosmeticsTreatment = () => {
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

export default CosmeticsTreatment