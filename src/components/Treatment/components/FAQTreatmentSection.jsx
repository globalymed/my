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
                        Get answers to common questions about dental treatment in India
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