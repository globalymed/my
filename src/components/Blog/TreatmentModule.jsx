import React from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
} from "@mui/material"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { Link as RouterLink } from "react-router-dom"

const treatments = [
  {
    id: 1,
    title: "Cardiac Catheterization",
    description:
      "Minimally invasive procedure to diagnose and treat heart conditions",
    image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg",
    costRange: "$3,000 - $8,000",
    recoveryTime: "1-2 days",
    successRate: 95,
    slug: "cardiac-catheterization",
  },
  {
    id: 2,
    title: "Bypass Surgery",
    description: "Surgical procedure to improve blood flow to the heart",
    image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg",
    costRange: "$70,000 - $200,000",
    recoveryTime: "6-8 weeks",
    successRate: 98,
    slug: "bypass-surgery",
  },
  {
    id: 3,
    title: "Angioplasty",
    description: "Procedure to open blocked or narrowed coronary arteries",
    image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg",
    costRange: "$15,000 - $35,000",
    recoveryTime: "3-5 days",
    successRate: 92,
    slug: "angioplasty",
  },
]

export function TreatmentModule() {
  return (
    <Box
      sx={{
        my: 12,
        p: 4,
        borderRadius: 4,
        background: "linear-gradient(to right, #eff6ff, #ecfdf5)",
      }}
    >
      <Box textAlign="center" mb={6}>
        <Chip
          label="Deep Dive"
          sx={{ mb: 2, bgcolor: "primary.main", color: "white", fontWeight: 600 }}
        />
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Related Treatment Options
        </Typography>
        <Typography color="text.secondary" maxWidth="600px" mx="auto">
          Explore comprehensive treatment options related to cardiac health. Get
          detailed information about procedures, costs, and success rates.
        </Typography>
      </Box>

      <Grid container spacing={3} mb={6}>
        {treatments.map((treatment) => (
          <Grid item xs={12} md={4} key={treatment.id}>
            <Card
              elevation={3}
              sx={{
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardMedia
                component="img"
                image={treatment.image}
                alt={treatment.title}
                height="192"
                sx={{
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {treatment.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {treatment.description}
                </Typography>

                <Stack spacing={1} mb={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
                      <AttachMoneyIcon fontSize="small" />
                      Cost Range
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {treatment.costRange}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
                      <AccessTimeIcon fontSize="small" />
                      Recovery
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {treatment.recoveryTime}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
                      <TrendingUpIcon fontSize="small" />
                      Success Rate
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" color="success.main">
                      {treatment.successRate}%
                    </Typography>
                  </Box>
                </Stack>

                <CardActions>
                  <Button
                    component={RouterLink}
                    to={`/treatments/${treatment.slug}`}
                    fullWidth
                    variant="outlined"
                    sx={{
                      bgcolor: "transparent",
                      "&:hover": { bgcolor: "#eff6ff" },
                    }}
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center">
        <Button
          component={RouterLink}
          to="/treatments"
          size="large"
          variant="contained"
          sx={{
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
          endIcon={<ArrowForwardIcon />}
        >
          View All Treatments
        </Button>
      </Box>
    </Box>
  )
}

export default TreatmentModule
