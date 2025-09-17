import {
    Box,
} from '@mui/material';

import TreatmentHeroSection from './components/dentalComponents/HeroSection';
import AdvanceTreatmentSection from './components/dentalComponents/AdvanceTreatmentSection';
import GlobalTreatmentSection from './components/dentalComponents/GlobalTreatmentSection';
import FAQTreatmentSection from './components/dentalComponents/FAQTreatmentSection';
import FinalCTATreatmentSecion from './components/dentalComponents/FinalCTATreatmentSection';
import WorkingTreatmentSection from './components/dentalComponents/WorkingTreatmentSection';
import TopClinicsTreatmentSection from './components/dentalComponents/TopClinicsTreatmentSection';
import TransformationTreatmentSection from './components/dentalComponents/TransformationTreatmentSection';
import SuccessStoriesTreatmentSection from './components/dentalComponents/SuccessStoriesTreatmentSection';
import ReviewsTreatmentSecion from './components/dentalComponents/ReviewsTreatmentSection';
import TravelSupportTreatmentSection from './components/dentalComponents/TravelSupportTreatmentSection';
import LatestBlogTreatmentSection from './components/dentalComponents/LatestBlogTreatmentSection';
import SEO from '../SEO.jsx';
import { structuredDataTemplates } from '../../utils/structuredData.js';


export default function DentalTreatmentPageMUI() {
    const dentalStructuredData = [
        structuredDataTemplates.service(
            "Dental Care in India", 
            "Complete dental services including implants, braces, cosmetic dentistry, root canal, gum contouring, and routine oral care with world-class facilities and experienced dentists.",
            "https://medyatra.space/treatment/dental"
        ),
        structuredDataTemplates.medicalOrganization
    ];

    return (
        <>
            <SEO
                title="Dental Treatment in India - Complete Dental Care Services"
                description="Get world-class dental treatment in India including implants, braces, cosmetic dentistry, root canal, and gum contouring. Book appointments with top dental clinics through MedYatra."
                keywords="dental treatment India, dental implants India, dental braces India, cosmetic dentistry India, root canal India, gum contouring India, dental tourism India, dental care India"
                canonical="https://medyatra.space/treatment/dental"
                ogTitle="Dental Treatment in India - Complete Dental Care Services"
                ogDescription="World-class dental treatment in India with experienced dentists. Get dental implants, braces, cosmetic dentistry, and more at affordable prices."
                ogImage="https://medyatra.space/dental/dental.webp"
                ogUrl="https://medyatra.space/treatment/dental"
                structuredData={dentalStructuredData}
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
                <ReviewsTreatmentSecion />

                {/* Travel & Accommodation Support */}
                <TravelSupportTreatmentSection />

                {/* Latest Blog Section */}
                <LatestBlogTreatmentSection />

                {/* FAQs Section */}
                <FAQTreatmentSection />

                {/* Final CTA Section */}
                <FinalCTATreatmentSecion />
            </Box>
        </>
    );
}