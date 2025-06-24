import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import IVF from './IVF';
import Cosmetic from './Cosmetics';
import Hair from './Hair';
import Dental from './Dental';

// Treatment data
const treatmentsData = {
  ivf: <IVF />,
  cosmetic: <Cosmetic />,
  hair: <Hair />,
  dental: <Dental />
};

const TreatmentsInfo = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('ivf');
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        pb: 1
      }}>
        <Typography variant="h5" component="div" fontWeight={700}>
          Know Your Treatment
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab label="IVF" value="ivf" />
          <Tab label="Cosmetic" value="cosmetic" />
          <Tab label="Hair" value="hair" />
          <Tab label="Dental" value="dental" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {treatmentsData[activeTab]}
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreatmentsInfo;
