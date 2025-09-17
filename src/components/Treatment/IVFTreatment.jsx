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
import SEO from '../SEO.jsx';
import { structuredDataTemplates } from '../../utils/structuredData.js';


const IVFTreatment = () => {
  const ivfStructuredData = [
    structuredDataTemplates.service(
      "IVF Treatment in India", 
      "Advanced fertility treatments including in vitro fertilization (IVF), ICSI, IUI, egg freezing, and comprehensive reproductive health consultations with world-renowned fertility specialists.",
      "https://medyatra.space/treatment/ivf"
    ),
    structuredDataTemplates.medicalOrganization
  ];

  return (
    <>
      <SEO
        title="IVF Treatment in India - Advanced Fertility Care Services"
        description="Get world-class IVF treatment in India with experienced fertility specialists. Advanced procedures including IVF, ICSI, IUI, egg freezing, and comprehensive reproductive health care."
        keywords="IVF treatment India, fertility treatment India, IVF cost India, ICSI treatment India, IUI treatment India, egg freezing India, fertility clinic India, reproductive health India"
        canonical="https://medyatra.space/treatment/ivf"
        ogTitle="IVF Treatment in India - Advanced Fertility Care Services"
        ogDescription="World-class IVF and fertility treatments in India with experienced specialists. Get IVF, ICSI, IUI, and egg freezing at affordable prices with high success rates."
        ogImage="https://medyatra.space/ivf/intro.webp"
        ogUrl="https://medyatra.space/treatment/ivf"
        structuredData={ivfStructuredData}
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
    </>
  );
}

export default IVFTreatment