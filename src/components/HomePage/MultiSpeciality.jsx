import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const treatments = [
    {
        name: "IVF",
        subtitle: "Journey To Parenthood with IVF",
        description:
            "Struggling to conceive? IVF is a proven method where eggs and sperm are combined in a lab, and embryos are implanted in the uterus.",
        types: [
            "Fertility Assessments",
            "IVF & IUI Procedures",
            "Eggs Freezing",
            "Genetic Testing",
            "Fertility Preservation",
        ],
        fee: "Free",
        tag: "Available Today",
        image: "/multispeciality_treatment/ivf.webp",
    },
    {
        name: "Hair Transplant",
        subtitle: "Regain Your Hair, Regain Confidence",
        description:
            "Hair transplant restores natural look using advanced FUE & FUT methods to move healthy follicles to balding areas.",
        types: [
            "FUE (Follicular Unit Extraction)",
            "FUT (Strip Method)",
            "DHI (Direct Hair Implantation)",
            "Beard / Eyebrow Transplants",
            "Scalp Micropigmentation",
        ],
        fee: "Free",
        tag: "Available Today",
        image: "/multispeciality_treatment/hair transplant.webp",
    },
    {
        name: "Dental Care",
        subtitle: "Dental Care That Makes You Smile",
        description:
            "We connect you with expert dental care - from basic cleaning to full smile makeovers - using cutting-edge technology.",
        types: [
            "Implants & Root Canals",
            "Braces & Aligners",
            "Teeth Whitening",
            "Smile Makeovers",
            "Full Mouth Rehab",
        ],
        fee: "Free",
        tag: "Available Today",
        image: "/multispeciality_treatment/dental.webp",
    },
    {
        name: "Cosmetic Procedures",
        subtitle: "Redefine Your With Confidence",
        description:
            "From subtle enhancements to full transformations, we help you access global cosmetic care with ease.",
        types: [
            "Botox & Fillers",
            "Liposuction & Rhinoplasty",
            "Skin Rejuvenation",
            "Facelift & Breast Procedures",
            "Plastic Surgery"
        ],
        fee: "Free",
        tag: "Available Today",
        image: "/multispeciality_treatment/cosmetic.webp",

    },
];


const TreatmentCard = ({ treatment }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        maxWidth: 300,
        width: '100%',
        height: '100%', // allow Grid to stretch them evenly
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1,
        boxShadow: 3,
        position: 'relative',
      }}
    >
      <Box position="relative">
        <CardMedia 
          component="img" 
          height="200" 
          image={treatment.image}
          alt={`${treatment.name} representative`} 
          loading="lazy"
          decoding="async"
        />
        <Chip
          label={treatment.tag}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: '#EAFBF5',
            color: '#005C4B',
            fontWeight: 600,
          }}
        />
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography fontWeight={700} fontSize="1rem" gutterBottom>
          {treatment.name}
        </Typography>
        <Typography fontWeight={600} fontSize="0.9rem" sx={{ color: '#333' }}>
          {treatment.subtitle}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {treatment.description}
        </Typography>

        <Box mt={2}>
          <Typography fontWeight={600}>Types:</Typography>
          {treatment.types.map((type, i) => (
            <Typography variant="body2" key={i} sx={{ color: 'text.secondary', mb: 1 }}>
              {type}
            </Typography>
          ))}
        </Box>

        <Typography fontWeight={600} fontSize="0.9rem" sx={{ mt: 2, textAlign: 'center' }}>
          Travel, treatment & transformation – <br /> all handled by Medyatra
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography color='#000' fontWeight={700}>{treatment.fee}</Typography>
          <Typography variant="caption" color="#666666">
            Consultation fee
          </Typography>
        </Box>

        <Button
          variant="outlined"
          fullWidth
          sx={{
            mt: 'auto',
            backgroundColor: '#1D4645',
            borderColor: '#1D4645',
            color: '#fff',
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#333',
              borderColor: '#333',
            },
          }}
          onClick={() => navigate('/free-consultation')}
        >
          Free Consultation
        </Button>
      </CardContent>
    </Card>
  );
};

const MultiSpecialitySection = () => {
    const navigate = useNavigate();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    return (
        <Box sx={{ py: 8, px: { xs: 2, md: 8 }, backgroundColor: '#f9f0e7' }}>
            <Typography variant="h2" fontWeight={700} textAlign="center">
                Multi Speciality Treatment Needs
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
                Our platform streamlines the accelerator application process from start to finish.
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {treatments.map((t, i) => (
                    <Grid item key={i} xs={12} sm={6} md={3} display="flex" justifyContent="center">
                        <TreatmentCard treatment={t} />
                    </Grid>
                ))}
            </Grid>

            <Box textAlign="center" mt={6}>
                <Button
                    variant="outlined"
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 4,
                        py: 1,
                        fontWeight: 600,
                        color: '#333333',
                        backgroundColor: '#fff',
                        borderColor: '#999999',
                        '&:hover': {
                            backgroundColor: '#eee',
                            borderColor: '#333333',
                        },
                    }}
                    onClick={() => navigate('/free-consultation')}
                >
                    View All Doctors
                </Button>
            </Box>
        </Box>
    );
};

export default MultiSpecialitySection;