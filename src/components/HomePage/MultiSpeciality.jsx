import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Chip, Divider } from '@mui/material';

const treatments = [
    {
        name: "Journey To Parenthood with IVF",
        subtitle: "IVF - Bringing Dreams to Life",
        description:
            "Hair transplant restores natural look using advanced FUE & FUT methods to move healthy follicles to balding areas.",
        types: [
            "FUE (Follicular Unit Extraction)",
            "FUT (Strip Method)",
            "DHI (Direct Hair Implantation)",
            "Beard / Eyebrow Transplants",
        ],
        fee: "₹XXX",
        tag: "Available Today",
        image: "/doctors/doctor1.png",
    },
    {
        name: "Journey To Parenthood with IVF",
        subtitle: "IVF - Bringing Dreams to Life",
        description:
            "Hair transplant restores natural look using advanced FUE & FUT methods to move healthy follicles to balding areas.",
        types: [
            "FUE (Follicular Unit Extraction)",
            "FUT (Strip Method)",
            "DHI (Direct Hair Implantation)",
            "Beard / Eyebrow Transplants",
        ],
        fee: "₹XXX",
        tag: "Available Today",
        image: "/doctors/doctor2.png",
    },
    {
        name: "Journey To Parenthood with IVF",
        subtitle: "IVF - Bringing Dreams to Life",
        description:
            "Hair transplant restores natural look using advanced FUE & FUT methods to move healthy follicles to balding areas.",
        types: [
            "FUE (Follicular Unit Extraction)",
            "FUT (Strip Method)",
            "DHI (Direct Hair Implantation)",
            "Beard / Eyebrow Transplants",
        ],
        fee: "₹XXX",
        tag: "Available Today",
        image: "/doctors/doctor3.png",
    },
    {
        name: "Journey To Parenthood with IVF",
        subtitle: "IVF - Bringing Dreams to Life",
        description:
            "Hair transplant restores natural look using advanced FUE & FUT methods to move healthy follicles to balding areas.",
        types: [
            "FUE (Follicular Unit Extraction)",
            "FUT (Strip Method)",
            "DHI (Direct Hair Implantation)",
            "Beard / Eyebrow Transplants",
        ],
        fee: "₹XXX",
        tag: "Available Today",
        image: "/doctors/doctor4.png",
    },
];


const TreatmentCard = ({ treatment }) => (
    <Card sx={{ maxWidth: 300, width: '100%', borderRadius: 1, boxShadow: 3, position: 'relative' }}>
        <Box position="relative">
            <CardMedia component="img" height="200" image={treatment.image} alt="Doctor" />
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
        <CardContent>
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

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={700}>{treatment.fee}</Typography>
                <Typography variant="caption" color="text.secondary">
                    Consultation fee
                </Typography>
            </Box>

            <Button
                variant="outlined"
                fullWidth
                sx={{
                    mt: 2,
                    backgroundColor: '#000',
                    borderColor: '#000',
                    color: '#fff',
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: '#333',
                        borderColor: '#333',
                    },
                }}
            >
                Book Now
            </Button>
        </CardContent>
    </Card>
);

const MultiSpecialitySection = () => {
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
                    <Grid item key={i}>
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
                        borderColor: '#333333',
                        '&:hover': {
                            backgroundColor: '#eee',
                            borderColor: '#333333',
                        },
                    }}
                >
                    View All Doctors
                </Button>
            </Box>
        </Box>
    );
};

export default MultiSpecialitySection;
