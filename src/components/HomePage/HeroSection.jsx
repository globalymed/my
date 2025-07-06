import { Box, Button, Typography, Stack, Grid, Chip, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {
    PeopleAlt,
    Star,
    Verified,
} from '@mui/icons-material';

const HeroSection = () => {

    const chipData = [
        { label: '10000+ patients served', icon: <PeopleAlt fontSize="small" /> },
        { label: '4.9 ⭐ average rating', icon: <Star fontSize="small" /> },
        { label: 'Trusted by Hospitals', icon: <Verified fontSize="small" /> }
    ];

    return (
        <Box maxWidth="lg" alignContent={"center"} mx="auto"
            sx={{
                // px: { xs: 2, md: 8 },
                py: 6,
                // backgroundColor: '#fff',
                borderRadius: 2,
            }}
        >
            <Grid container spacing={4} alignItems="center">
                {/* LEFT SIDE */}
                <Grid item xs={12} md={6}>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' } }}
                    >
                        World-Class Medical
                    </Typography>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '3rem' }, color: "#333333" }}
                    >
                        Care Made Simple
                        & Affordable.
                    </Typography>

                    <Typography sx={{ mb: 3, color: 'text.secondary', maxWidth: 450 }}>
                        From diagnosis to travel – our AI assistant ensures effortless treatment planning in India's top hospitals.
                    </Typography>

                    {/* CTA Buttons */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                        <Button
                            variant="outlined"
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#333',
                                    borderColor: '#333',
                                },
                            }}
                        >
                            Chat With AI Agent
                        </Button>

                        <Button
                            variant="outlined"
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                textTransform: 'none',
                                borderColor: 'black',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                    borderColor: '#0f0f0f',
                                },
                            }}
                        >
                            Compare Treatment Cost
                        </Button>
                    </Stack>

                    {/* Trust badges */}
                    <Stack direction="row" gap={2} flexWrap="wrap" mb={3}>
                        {chipData.map((item) => (
                            <Chip
                                key={item.label}
                                icon={item.icon}
                                label={item.label}
                                variant="outlined"
                                sx={{
                                    backgroundColor: '#EEFAF9',
                                    color: '#333333',
                                    borderColor: '#28938C'
                                }}
                            />
                        ))}
                    </Stack>

                    {/* Partner logos */}
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                        Trusted by leading healthcare partners:
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        {['Apollo', 'Fortis', 'Max', 'AIIMS'].map((name) => (
                            <Chip
                                key={name}
                                label={name}
                                variant="outlined"
                                sx={{
                                    backgroundColor: '#EEFAF9',
                                    color: 'black',
                                    borderColor: "#28938C"
                                }}
                            />
                        ))}
                    </Stack>
                </Grid>

                {/* RIGHT SIDE */}
                <Grid item xs={12} md={6}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        width: '100%',
                        maxWidth: 500,
                        mx: 'auto',
                        p: 3,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: 3,
                    }}>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                textAlign: 'center',
                                color: '#1D4645',
                                fontWeight: 'bold',
                                mb: 2
                            }}
                        >
                            Get Free Consultation and Quote
                        </Typography>
                        
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Patient Name"
                                variant="outlined"
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                            />
                            
                            <TextField
                                fullWidth
                                label="Home Country"
                                variant="outlined"
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                            />
                            
                            <FormControl fullWidth required>
                                <InputLabel>Treatment Needed</InputLabel>
                                <Select
                                    label="Treatment Needed"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                >
                                    <MenuItem value="ivf">IVF</MenuItem>
                                    <MenuItem value="hair">Hair</MenuItem>
                                    <MenuItem value="cosmetic">Cosmetic</MenuItem>
                                    <MenuItem value="dental">Dental</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <TextField
                                fullWidth
                                label="Describe Current Medical Problem"
                                variant="outlined"
                                multiline
                                rows={3}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                            />
                            
                            <TextField
                                fullWidth
                                label="Phone Number (with country code)"
                                variant="outlined"
                                required
                                placeholder="+1 234 567 8900"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                            />
                            
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#1D4645',
                                    color: 'white',
                                    textTransform: 'none',
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    borderRadius: 1,
                                    '&:hover': {
                                        backgroundColor: '#1f6f6a',
                                    },
                                }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HeroSection;
