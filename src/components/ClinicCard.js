import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Button, 
  Rating, 
  IconButton, 
  Collapse, 
  Grid, 
  Divider,
  Avatar,
  useTheme
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const ClinicCard = ({ clinic, onBookNow }) => {
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const theme = useTheme();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  // Generate a random number of reviews between 50 and 200
  const reviewCount = Math.floor(Math.random() * 150) + 50;
  
  // Generate random pricing information
  const priceRange = ['₹1,000 - ₹2,500', '₹1,500 - ₹3,000', '₹2,000 - ₹4,500', '₹3,000 - ₹6,000'];
  const randomPriceIndex = Math.floor(Math.random() * priceRange.length);
  
  // Generate random wait time
  const waitTimes = ['10-15 min', '15-20 min', '5-10 min', '20-30 min'];
  const randomWaitTimeIndex = Math.floor(Math.random() * waitTimes.length);

  // Generate a random discount
  const discounts = ['20% off first visit', '15% off consultation', 'Free follow-up', 'Package deals available'];
  const randomDiscountIndex = Math.floor(Math.random() * discounts.length);

  return (
    <Card 
      sx={{ 
        mb: 3,
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -5,
          left: 20,
          right: 20,
          height: 10,
          backgroundColor: theme.palette.primary.main,
          borderRadius: '10px 10px 0 0',
          opacity: 0.7
        }
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Grid container>
          <Grid item xs={12} md={3} sx={{ 
            position: 'relative', 
            minHeight: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            borderRadius: { xs: '16px 16px 0 0', md: '16px 0 0 16px' }
          }}>
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              height: '100%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2
            }}>
              <Avatar 
                src={`https://source.unsplash.com/random/300x300/?hospital,clinic,medical&${clinic.id}`} 
                alt={clinic.name}
                variant="rounded"
                sx={{ 
                  width: '80%', 
                  height: 140,
                  boxShadow: theme.shadows[4],
                  border: '4px solid white'
                }}
              />
              {clinic.rating >= 4.7 && (
                <Chip
                  icon={<VerifiedIcon fontSize="small" />}
                  label="Top Rated"
                  color="primary"
                  size="small"
                  sx={{ 
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontWeight: 600,
                    backgroundColor: theme.palette.primary.main,
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                    {clinic.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={clinic.rating} 
                      precision={0.1} 
                      readOnly 
                      size="small"
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
                      {clinic.rating} ({reviewCount} reviews)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.error.main }} />
                    <Typography variant="body2">
                      {clinic.distance ? `${clinic.distance.toFixed(1)} km away` : '3.2 km away'} • Delhi, India
                    </Typography>
                  </Box>
                </Box>
                
                <IconButton 
                  onClick={toggleBookmark} 
                  sx={{ 
                    color: bookmarked ? theme.palette.secondary.main : 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.08)'
                    }
                  }}
                >
                  {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {clinic.services && clinic.services.map((service, index) => (
                  <Chip 
                    key={index} 
                    label={service} 
                    size="small" 
                    sx={{ 
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      color: theme.palette.primary.dark,
                      fontWeight: 500
                    }} 
                  />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.warning.main }} />
                    <Typography variant="body2" color="text.secondary">
                      {waitTimes[randomWaitTimeIndex]}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalOfferIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.success.main }} />
                    <Typography variant="body2" color="text.secondary">
                      {discounts[randomDiscountIndex]}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={toggleExpanded}
                    endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ mr: 1 }}
                  >
                    {expanded ? 'Less' : 'More'}
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => onBookNow(clinic)}
                    sx={{ fontWeight: 600 }}
                  >
                    Book Now
                  </Button>
                </Box>
              </Box>
              
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        About Clinic
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {clinic.name} is a leading healthcare provider specializing in {clinic.services && clinic.services.join(', ')}. 
                        With state-of-the-art facilities and experienced doctors, we provide comprehensive care tailored to your needs.
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        Pricing & Insurance
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Price Range:</strong> {priceRange[randomPriceIndex]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Insurance:</strong> We accept most major insurance providers including CGHS, Mediclaim, and corporate health plans.
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        Available Services
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {clinic.services && [...clinic.services, 'Consultations', 'Diagnostics', 'Follow-ups', 'Treatments'].map((service, index) => (
                          <Chip 
                            key={index} 
                            label={service} 
                            size="small" 
                            sx={{ 
                              backgroundColor: index % 2 === 0 ? 'rgba(37, 99, 235, 0.08)' : 'rgba(139, 92, 246, 0.08)',
                              color: index % 2 === 0 ? theme.palette.primary.dark : theme.palette.secondary.dark,
                              fontWeight: 500
                            }} 
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ClinicCard;
