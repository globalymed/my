import React from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
} from '@mui/material';

// Material-UI Icons
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutline from '@mui/icons-material/MailOutline';
import Security from '@mui/icons-material/Security';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import AttachMoney from '@mui/icons-material/AttachMoney';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import ExpandMore from '@mui/icons-material/ExpandMore';

// React Icons (for icons not readily available in MUI)
import { TbDental, TbCrown, TbHealthRecognition } from 'react-icons/tb';
import { GiTooth, GiBridge, GiMedicalDrip } from 'react-icons/gi';
import TreatmentHeroSection from './components/HeroSection';
import AdvanceTreatmentSection from './components/AdvanceTreatmentSection';
import GlobalTreatmentSection from './components/GlobalTreatmentSection';
import FAQTreatmentSection from './components/FAQTreatmentSection';
import FinalCTATreatmentSecion from './components/FinalCTATreatmentSection';


export default function DentalTreatmentPageMUI() {


    const faqs = [
        {
            question: "Is it safe to get dental treatment in India?",
            answer:
                "Yes, India has world-class dental facilities with international accreditations like JCI and NABH. Our partner clinics maintain the highest safety and hygiene standards, often exceeding those in Western countries.",
        },
        {
            question: "What documents do I need for dental treatment in India?",
            answer:
                "You'll need a valid passport, visa (if required), medical records, dental X-rays, and any previous treatment history. We help you prepare all necessary documentation.",
        },
        {
            question: "Can I do multiple treatments in one trip?",
            answer:
                "Many patients combine multiple procedures like implants, crowns, and whitening in a single trip. Our AI planner optimizes your treatment schedule for maximum efficiency.",
        },
        {
            question: "How do I pay for treatments?",
            answer:
                "We accept international credit cards, bank transfers, and cash payments. Payment plans are available for extensive treatments. All costs are transparent with no hidden fees.",
        },
        {
            question: "Can I consult with doctors before traveling?",
            answer:
                "Yes! We arrange virtual consultations with our dental specialists. You can discuss your case, see the facilities, and get personalized treatment plans before making any travel commitments.",
        },
        {
            question: "What if I need follow-up care after returning home?",
            answer:
                "We provide detailed aftercare instructions and maintain communication with your local dentist. For complex cases, we offer telemedicine follow-ups and can coordinate with dental professionals in your home country.",
        },
        {
            question: "How much can I save compared to my home country?",
            answer:
                "Patients typically save 60-80% compared to US, UK, or Australian prices. For example, dental implants cost $500-900 in India vs $3,000-6,000 in the US, including travel expenses.",
        },
        {
            question: "What if something goes wrong during treatment?",
            answer:
                "All our partner clinics have comprehensive insurance and emergency protocols. We provide 24/7 support during your stay and have established relationships with top hospitals for any complications.",
        },
    ];

    const StatCard = ({ icon, value, label, color = '#1976d2' }) => (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                borderRadius: 2,
                height: '100%',
            }}
        >
            <Box sx={{ color }}>{icon}</Box>
            <Typography variant="h5" fontWeight="bold">
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
        </Paper>
    );

    return (
        <Box sx={{ bgcolor: 'white', overflow: 'hidden' }}>
            {/* Hero Section */}
            <TreatmentHeroSection />

            {/* Common Dental Treatments Section */}
            <AdvanceTreatmentSection />

            {/* Why India Section */}
            <GlobalTreatmentSection />

            {/* FAQs Section */}
            <FAQTreatmentSection />

            {/* Final CTA Section */}
            <FinalCTATreatmentSecion />
        </Box>
    );
}