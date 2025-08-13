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
        question: "What are the success rates for IVF in India?",
        answer: "Leading IVF centers in India report success rates of 40-60% per cycle, which are comparable to or better than international standards. Success rates depend on factors like age, cause of infertility, and clinic expertise.",
    },
    {
        question: "How much can I save by getting IVF treatment in India?",
        answer: "Patients typically save 60-80% compared to US, UK, or European prices. IVF cycles cost $2,500-4,000 in India vs $12,000-20,000 in the US, including all medications and procedures.",
    },
    {
        question: "Are Indian IVF clinics safe and reliable?",
        answer: "Yes, top IVF centers in India are accredited by JCI and NABH, maintaining international standards. Many have state-of-the-art labs, experienced embryologists, and board-certified reproductive endocrinologists.",
    },
    {
        question: "How long do I need to stay in India for IVF?",
        answer: "A typical IVF cycle requires 2-3 weeks in India. This includes initial consultations, ovarian stimulation monitoring, egg retrieval, embryo transfer, and initial follow-up. Some protocols may require shorter or longer stays.",
    },
    {
        question: "Can I use donor eggs or sperm in India?",
        answer: "Yes, India has well-established donor programs with extensive screening processes. Egg and sperm donation are legal and regulated, with donors undergoing comprehensive medical and psychological evaluations.",
    },
    {
        question: "What if my first IVF cycle fails?",
        answer: "Many clinics offer package deals for multiple cycles. If the first cycle fails, the clinic will review the protocol and make adjustments for subsequent attempts. Frozen embryo transfers from the same cycle are also possible.",
    },
    {
        question: "Is surrogacy legal in India?",
        answer: "Surrogacy is legal in India for international patients under specific conditions. The Surrogacy Regulation Act 2021 allows altruistic surrogacy for foreign couples with proper documentation and medical necessity.",
    },
    {
        question: "What support is available during treatment?",
        answer: "We provide comprehensive support including airport transfers, accommodation, local transportation, interpreter services, and 24/7 medical coordination throughout your treatment journey.",
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