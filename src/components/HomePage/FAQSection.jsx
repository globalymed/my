import React from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // ✅ Correct default import
import { useNavigate } from 'react-router-dom';

const faq = [
    {
        question: "What is MedYatra?",
        answer:
            "MedYatra is a healthcare travel platform that connects you with top clinics and hospitals in India for Hair, IVF, Dental, and Cosmetic treatments. We also assist with travel, accommodation, and concierge services."
    },
    {
        question: "How do I book a treatment through MedYatra?",
        answer:
            "You can select a treatment, choose a clinic, and book a consultation directly through our website. Our team will assist you throughout the process."
    },
    {
        question: "Do you provide assistance with travel and accommodation?",
        answer:
            "Yes. We offer travel packages that include flights, hotel bookings, local transport (like Uber), and appointment scheduling."
    },
    {
        question: "Are the clinics and doctors verified?",
        answer:
            "All listed clinics and doctors go through a thorough verification process based on experience, accreditation, and patient reviews."
    },
    {
        question: "Can international patients use MedYatra?",
        answer:
            "Absolutely. MedYatra is built for both Indian and international patients seeking affordable, high-quality treatments in India."
    }
];

const FAQSection = (props) => {
    const navigate = useNavigate();
    return (
        <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, md: 8 }, backgroundColor: '#F8EEE2CC' }}>
            <Box maxWidth="lg" mx="auto">
                <Grid container spacing={4} alignItems="center">
                    {/* Left Image */}
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                            component="img"
                            src="/faq-illustration.png" // update path accordingly
                            alt="Doctor FAQ"
                            sx={{
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: 2
                            }}
                        />
                    </Grid>

                    {/* Right Content */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" fontWeight={700} mb={1}>
                            Frequently Asked Questions
                        </Typography>
                        <Typography color="text.secondary" mb={4}>
                            Get answers to common questions about MedYatra
                        </Typography>

                        {faq.map((item, index) => (
                            <Accordion key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`faq-${index}`}>
                                    <Typography variant="h6">{item.question}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}

                        {/* Support Button */}
                        <Box mt={4} textAlign="center">
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                Still have questions?
                            </Typography>
                            <Button
                                variant="outlined"
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 1,
                                    px: 4,
                                    py: 1,
                                    fontWeight: 600,
                                    color: '#999999',
                                    backgroundColor: '#fff',
                                    borderColor: '#999999',
                                    '&:hover': {
                                        backgroundColor: '#eee',
                                        borderColor: '#999999',
                                    },
                                }}
                                onClick={() => navigate('/free-consultation')}
                            >
                                Contact Us Now ! 
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default FAQSection;
