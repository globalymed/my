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
import SEO from '../SEO.jsx';
import { structuredDataTemplates } from '../../utils/structuredData.js';


const CosmeticsTreatment = () => {
  const cosmeticsStructuredData = [
    structuredDataTemplates.service(
      "Cosmetic Surgery in India", 
      "Advanced aesthetic treatments including rhinoplasty, liposuction, breast augmentation, skin rejuvenation, non-surgical enhancements, and comprehensive cosmetic surgery procedures.",
      "https://medyatra.space/treatment/cosmetics"
    ),
    structuredDataTemplates.medicalOrganization
  ];

  return (
    <>
      <SEO
        title="Cosmetic Surgery in India - Advanced Aesthetic Treatments"
        description="Get world-class cosmetic surgery in India including rhinoplasty, liposuction, breast augmentation, skin rejuvenation, and non-surgical enhancements with experienced plastic surgeons."
        keywords="cosmetic surgery India, rhinoplasty India, liposuction India, breast augmentation India, skin rejuvenation India, plastic surgery India, aesthetic treatments India"
        canonical="https://medyatra.space/treatment/cosmetics"
        ogTitle="Cosmetic Surgery in India - Advanced Aesthetic Treatments"
        ogDescription="World-class cosmetic surgery and aesthetic treatments in India with experienced plastic surgeons. Get rhinoplasty, liposuction, and more at affordable prices."
        ogImage="https://medyatra.space/cosmetics/cosmetics.webp"
        ogUrl="https://medyatra.space/treatment/cosmetics"
        structuredData={cosmeticsStructuredData}
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

export default CosmeticsTreatment