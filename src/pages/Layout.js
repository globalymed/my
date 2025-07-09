import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';
import TreatmentsInfo from '../components/TreatmentsInfo';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const Layout = ({ children }) => {
  const [showTreatmentsInfo, setShowTreatmentsInfo] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header and Sidebar */}
      <Sidebar />

      {/* Children Content  */}
      <Box maxWidth="100%" component="main" sx={{
        flexGrow: 1,
        background: 'linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: 'calc(100vh - 64px)',
        px: 0,
      }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{ py: 3, px: 0 }}
        >
          {children}
        </Container>
      </Box>

      {/* footer */}

      <Footer />

      {/* Render TreatmentsInfo dialog when showTreatmentsInfo is true */}
      <TreatmentsInfo
        open={showTreatmentsInfo}
        onClose={() => setShowTreatmentsInfo(false)}
      />
    </Box>
  );
};

export default Layout;
