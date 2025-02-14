import React, { useState } from 'react';
import { Box, Typography, Rating, Chip, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Bookmark, BookmarkBorder } from '@mui/icons-material';
import { GoogleMap, Marker } from '@react-google-maps/api';
import './ClinicCard.css';

const ClinicCard = ({ clinic, onBookNow }) => {
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);
  const toggleBookmark = () => setBookmarked(!bookmarked);

  return (
    <Box className={`clinic-card ${expanded ? 'expanded' : ''}`}>
      <Box className="card-header" onClick={toggleExpanded}>
        <Typography variant="h6" className="clinic-name">{clinic.name}</Typography>
        <Box className="rating">
          <Rating value={clinic.rating} readOnly />
          <Typography variant="body2">({clinic.reviewCount})</Typography>
        </Box>
        <Box className="services">
          {clinic.services.slice(0, 5).map((service) => (
            <Chip key={service} label={service} size="small" />
          ))}
          {clinic.services.length > 5 && <Chip label="..." size="small" />}
        </Box>
        <Typography variant="body2" className="distance">{clinic.distance} km away</Typography>
        <Button variant="contained" color="primary" className="book-now" onClick={onBookNow}>
          Book Now
        </Button>
        <Button className="bookmark" onClick={toggleBookmark} aria-label="Bookmark">
          {bookmarked ? <Bookmark /> : <BookmarkBorder />}
        </Button>
      </Box>
      <Accordion expanded={expanded} onChange={toggleExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${clinic.id}-details`} id={`${clinic.id}-header`}>
          <Typography>More Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="full-services">
            <Typography variant="subtitle1">Services:</Typography>
            <ul>
              {clinic.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </Box>
          <Box className="hours">
            <Typography variant="subtitle1">Hours:</Typography>
            {/* Render operational hours calendar */}
          </Box>
          <Box className="contact">
            <Typography variant="subtitle1">Contact:</Typography>
            <Typography>Phone: {clinic.phone}</Typography>
            <Typography>Email: {clinic.email}</Typography>
          </Box>
          <Box className="map-preview">
            <GoogleMap 
              mapContainerStyle={{ width: '100%', height: '200px' }}
              center={clinic.location}
              zoom={14}
            >
              <Marker position={clinic.location} />
            </GoogleMap>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ClinicCard; 