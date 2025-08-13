import React from 'react';
import {
    Box,
    Container,
    Typography,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';


const faqs = [
    {
        question: "Is cosmetic surgery in India safe?",
        answer: "Yes, India has world-class cosmetic surgery centers with JCI and NABH accreditation. Board-certified plastic surgeons use the latest techniques and maintain international safety standards.",
    },
    {
        question: "How much can I save on cosmetic surgery in India?",
        answer: "Patients typically save 70-80% compared to US, UK, or European prices. For example, rhinoplasty costs $1,500-3,000 in India vs $8,000-15,000 in the US, including all expenses.",
    },
    {
        question: "Are the results comparable to Western countries?",
        answer: "Yes, many Indian plastic surgeons are trained internationally and use the same advanced techniques. The results are often superior due to more personalized attention and longer consultation times.",
    },
    {
        question: "How long do I need to stay in India for surgery?",
        answer: "Recovery time varies by procedure. Most surgeries require 7-14 days in India for initial healing and follow-up. Complex procedures may require longer stays for optimal recovery.",
    },
    {
        question: "What if complications arise after I return home?",
        answer: "We provide comprehensive aftercare support including telemedicine consultations, detailed recovery instructions, and coordination with local doctors in your home country if needed.",
    },
    {
        question: "Can I combine multiple procedures in one trip?",
        answer: "Yes, many patients combine procedures like mommy makeovers or facial rejuvenation packages. This can be more cost-effective and allows for coordinated recovery time.",
    },
    {
        question: "What credentials should I look for in a surgeon?",
        answer: "Look for board certification in plastic surgery, international training, hospital affiliations, and extensive experience in your specific procedure. We only partner with qualified surgeons.",
    },
    {
        question: "Is financing available for cosmetic surgery?",
        answer: "Yes, many clinics offer payment plans and financing options. Medical tourism packages can also be customized to fit different budgets while maintaining quality standards.",
    },
];

const FAQTreatmentSection = () => {
    return (
        <Box component="section" sx={{ py: { xs: 8, md: 12 }, px: 2, bgcolor: 'white' }}>
            <Container maxWidth="md">
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
                    <Chip
                        icon={<CheckCircleIcon sx={{ color: '#7e22ce !important' }} />}
                        label="Common Questions"
                        sx={{
                            mb: 3,
                            color: '#6b21a8',
                            borderRadius: 3,
                            px: 1,
                            fontWeight: 'medium',
                            background: 'linear-gradient(to right, #f3e8ff, #e0f2fe)',
                        }}
                    />
                    <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                        Frequently Asked
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #7e22ce, #2563eb)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Questions
                        </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'lg', mx: 'auto' }}>
                        Get answers to common questions about cosmetic surgery in India
                    </Typography>
                </Box>

                {/* Accordion List */}
                <Stack spacing={2.5}>
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            sx={{
                                border: 'none',
                                boxShadow: 6,
                                borderRadius: 3,
                                background: 'linear-gradient(to right, #f9fafb, #eff6ff)',
                                transition: 'box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    boxShadow: 10,
                                },
                                '&:before': {
                                    display: 'none',
                                },
                                '&.Mui-expanded': {
                                    margin: '0 !important',
                                }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index}-content`}
                                id={`panel${index}-header`}
                                sx={{
                                    py: 2,
                                    px: 3,
                                    '& .MuiAccordionSummary-content .MuiTypography-root': {
                                        fontWeight: 'bold',
                                        fontSize: '1.125rem',
                                        transition: 'color 0.3s',
                                    },
                                    '&:hover .MuiAccordionSummary-content .MuiTypography-root': {
                                        color: 'primary.main',
                                    }
                                }}
                            >
                                <Typography>{faq.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};

export default FAQTreatmentSection;