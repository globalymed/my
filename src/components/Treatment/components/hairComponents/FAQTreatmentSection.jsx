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
        question: "Is hair transplant in India safe and effective?",
        answer:
            "Yes, India has world-class hair transplant clinics with ISHRS certified surgeons. Many clinics use the latest FUE, DHI, and robotic techniques with success rates comparable to or better than Western countries.",
    },
    {
        question: "How much can I save by getting hair transplant in India?",
        answer:
            "Patients typically save 70-80% compared to US, UK, or European prices. For example, FUE hair transplant costs $800-2,000 in India vs $4,000-15,000 in the US, even including travel expenses.",
    },
    {
        question: "Which hair transplant technique is best for me?",
        answer:
            "The best technique depends on your hair loss pattern, donor area, and goals. FUE is minimally invasive with no scarring, DHI offers precise placement, and FUT can provide maximum grafts. Our AI analysis helps determine the best option.",
    },
    {
        question: "How long do I need to stay in India for hair transplant?",
        answer:
            "Most procedures require 2-3 days in India. Day 1 for consultation and procedure, Day 2 for post-op check, and Day 3 for final check before departure. Some complex cases may require longer stays.",
    },
    {
        question: "When will I see results from my hair transplant?",
        answer:
            "Initial growth starts at 3-4 months, significant growth at 6-8 months, and final results at 12-18 months. The transplanted hair will grow naturally for life.",
    },
    {
        question: "What is included in the hair transplant package?",
        answer:
            "Our packages typically include the procedure, post-op medications, follow-up consultations, airport transfers, and accommodation. Some packages also include sightseeing tours.",
    },
    {
        question: "Can I combine hair transplant with other procedures?",
        answer:
            "Yes, many patients combine hair transplant with beard transplant, eyebrow transplant, or other cosmetic procedures. This can be more cost-effective and convenient.",
    },
    {
        question: "What if I need follow-up care after returning home?",
        answer:
            "We provide detailed aftercare instructions and maintain communication through telemedicine. We can also coordinate with local doctors in your home country if needed.",
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
                        Get answers to common questions about hair transplant in India
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