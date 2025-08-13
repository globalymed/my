import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Container,
  Grid,
  Stack,
} from "@mui/material"
import {
  Search,
  Calculate,
  Public,
  TrendingDown,
  Favorite,
  LocalHospital,
  MonitorHeart,
  Medication,
  Star,
  EmojiEvents,
  Security,
  Schedule,
  ArrowForward,
  CheckCircle,
  Healing,
  MedicalServices,
  Female,
  FamilyRestroom,
} from "@mui/icons-material"

const treatmentData = {
  "Hair Transplant Surgery": {
    costs: {
      "United States": 13600,
      "United Kingdom": 10200,
      Germany: 7000,
      Singapore: 3250,
      Thailand: 2000,
      "India (Medyatra)": 3000,
      Turkey: 2675,
      Mexico: 3200,
    },
    category: "Hair Restoration",
    duration: "3-5 days",
    description: "Complete relocation of hair follicles with minimal downtime",
    rating: 4.8,
  },
  "PRP Therapy (Platelet-Rich Plasma)": {
    costs: {
      "United States": 6800,
      "United Kingdom": 6800,
      Germany: 1000,
      Singapore: 1200,
      Thailand: 700,
      "India (Medyatra)": 200,
      Turkey: 800,
      Mexico: 600,
    },
    category: "Hair Restoration",
    duration: "1-2 days",
    description: "Autologous plasma injection to stimulate hair growth",
    rating: 4.5,
  },
  "Laser Hair Growth Treatment": {
    costs: {
      "United States": 1500,
      "United Kingdom": 1200,
      Germany: 1100,
      Singapore: 1000,
      Thailand: 800,
      "India (Medyatra)": 300,
      Turkey: 700,
      Mexico: 500,
    },
    category: "Hair Restoration",
    duration: "1-2 days",
    description: "Non-invasive laser therapy for hair regrowth",
    rating: 4.4,
  },
  "Dental Implants": {
    costs: {
      "United States": 2500,
      "United Kingdom": 2400,
      Germany: 2500,
      Singapore: 5000,
      Thailand: 800,
      "India (Medyatra)": 600,
      Turkey: 400,
      Mexico: 1000,
    },
    category: "Dental",
    duration: "3-5 days",
    description: "Permanent titanium root and crown replacement",
    rating: 4.7,
  },
  "Root Canal Treatment": {
    costs: {
      "United States": 800,
      "United Kingdom": 600,
      Germany: 400,
      Singapore: 600,
      Thailand: 150,
      "India (Medyatra)": 50,
      Turkey: 100,
      Mexico: 200,
    },
    category: "Dental",
    duration: "1-2 days",
    description: "Removal of infected pulp to preserve the natural tooth",
    rating: 4.6,
  },
  "Gum Surgery (Periodontal Treatment)": {
    costs: {
      "United States": 1200,
      "United Kingdom": 1600,
      Germany: 2100,
      Singapore: 1500,
      Thailand: 300,
      "India (Medyatra)": 150,
      Turkey: 614,
      Mexico: 800,
    },
    category: "Dental",
    duration: "2-4 days",
    description: "Surgical repair of gums and bones to halt gum disease",
    rating: 4.5,
  },
  "Cosmetic Surgery": {
    costs: {
      "United States": 7500,
      "United Kingdom": 6200,
      Germany: 9900,
      Singapore: 15400,
      Thailand: 4600,
      "India (Medyatra)": 3500,
      Turkey: 3500,
      Mexico: 4000,
    },
    category: "Cosmetic",
    duration: "7-10 days",
    description: "Reshape or resize breasts for aesthetic enhancement",
    rating: 4.8,
  },
  "Facelift (Rhytidectomy)": {
    costs: {
      "United States": 15000,
      "United Kingdom": 6800,
      Germany: 8200,
      Singapore: 12000,
      Thailand: 4000,
      "India (Medyatra)": 3000,
      Turkey: 3500,
      Mexico: 4000,
    },
    category: "Cosmetic",
    duration: "7-10 days",
    description: "Surgical rejuvenation of facial skin and tissues",
    rating: 4.7,
  },
  "Blepharoplasty (Eyelid Surgery)": {
    costs: {
      "United States": 4700,
      "United Kingdom": 3200,
      Germany: 2100,
      Singapore: 4500,
      Thailand: 2100,
      "India (Medyatra)": 2800,
      Turkey: 1800,
      Mexico: 2500,
    },
    category: "Cosmetic",
    duration: "5-7 days",
    description: "Cosmetic or functional reshaping of eyelids",
    rating: 4.6,
  },
  "IVF (In-Vitro Fertilization)": {
    costs: {
      "United States": 14000,
      "United Kingdom": 7000,
      Germany: 7000,
      Singapore: 10000,
      Thailand: 8500,
      "India (Medyatra)": 2500,
      Turkey: 3500,
      Mexico: 6000,
    },
    category: "Fertility",
    duration: "15-20 days",
    description: "Lab fertilization of eggs and embryo implantation",
    rating: 4.9,
  },
  "IUI (Intrauterine Insemination)": {
    costs: {
      "United States": 3000,
      "United Kingdom": 2600,
      Germany: 1000,
      Singapore: 2000,
      Thailand: 1200,
      "India (Medyatra)": 200,
      Turkey: 800,
      Mexico: 1300,
    },
    category: "Fertility",
    duration: "1-2 days",
    description: "Sperm placement directly into uterus for conception",
    rating: 4.5,
  },
  "ICSI (Intracytoplasmic Sperm Injection)": {
    costs: {
      "United States": 1500,
      "United Kingdom": 3000,
      Germany: 3000,
      Singapore: 3500,
      Thailand: 8500,
      "India (Medyatra)": 3300,
      Turkey: 3500,
      Mexico: 4000,
    },
    category: "Fertility",
    duration: "1-2 days",
    description: "Advanced IVF injecting single sperm into the egg",
    rating: 4.8,
  },
}

const popularTreatments = [
  {
    name: "Hair Transplant Surgery",
    icon: Healing,
    color: "#f44336",
    bgColor: "#ffebee",
    borderColor: "#ffcdd2",
  },
  {
    name: "Dental Implants",
    icon: MedicalServices,
    color: "#4caf50",
    bgColor: "#e8f5e8",
    borderColor: "#c8e6c9",
  },
  {
    name: "Cosmetic Surgery",
    icon: Female,
    color: "#9c27b0",
    bgColor: "#f3e5f5",
    borderColor: "#e1bee7",
  },
  {
    name: "IVF (In-Vitro Fertilization)",
    icon: FamilyRestroom,
    color: "#2196f3",
    bgColor: "#e3f2fd",
    borderColor: "#bbdefb",
  },
]

const countryFlags = {
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  Germany: "🇩🇪",
  Singapore: "🇸🇬",
  Thailand: "🇹🇭",
  "India (Medyatra)": "🇮🇳",
  Turkey: "🇹🇷",
  Mexico: "🇲🇽",
}

export default function Component() {
  const [selectedTreatment, setSelectedTreatment] = useState("")
  const [showComparison, setShowComparison] = useState(false)
  const [animatedSavings, setAnimatedSavings] = useState(0)
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  const handleTreatmentSelect = (treatment) => {
    setSelectedTreatment(treatment)
    setShowComparison(true)
  }

  const handleSearch = () => {
    if (selectedTreatment) {
      setShowComparison(true)
    }
  }

  const currentTreatment = treatmentData[selectedTreatment]
  const medyatraCost = currentTreatment?.costs["India (Medyatra)"] || 0
  const highestCost = currentTreatment ? Math.max(...Object.values(currentTreatment.costs)) : 0
  const savings = highestCost - medyatraCost
  const savingsPercentage = highestCost > 0 ? Math.round(((highestCost - medyatraCost) / highestCost) * 100) : 0

  // Animate numbers when comparison shows
  useEffect(() => {
    if (showComparison && savings > 0) {
      const duration = 2000
      const steps = 60
      const savingsStep = savings / steps
      const percentageStep = savingsPercentage / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        setAnimatedSavings(Math.round(savingsStep * currentStep))
        setAnimatedPercentage(Math.round(percentageStep * currentStep))

        if (currentStep >= steps) {
          clearInterval(timer)
          setAnimatedSavings(savings)
          setAnimatedPercentage(savingsPercentage)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [showComparison, savings, savingsPercentage])

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <Box sx={{
          position: 'absolute',
          top: '-160px',
          right: '-160px',
          width: '320px',
          height: '320px',
          bgcolor: 'rgba(33, 150, 243, 0.2)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'pulse 3s ease-in-out infinite'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '-160px',
          left: '-160px',
          width: '320px',
          height: '320px',
          bgcolor: 'rgba(156, 39, 176, 0.2)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'pulse 3s ease-in-out infinite 1s'
        }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Enhanced Header */}
        <Box textAlign="center" mb={8}>
          <Stack direction="row" justifyContent="center" alignItems="center" gap={2} mb={3}>
            <Box position="relative">
              <Public sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography 
              variant="h2" 
              component="h1" 
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(45deg, #2196f3 30%, #9c27b0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Global Treatment Cost Comparison
            </Typography>
          </Stack>
          
          <Typography variant="h5" color="text.secondary" maxWidth="600px" mx="auto" mb={3}>
            Compare medical treatment costs worldwide and discover significant savings with{" "}
            <Typography component="span" color="success.main" fontWeight="bold">Medyatra</Typography>
          </Typography>
          
          <Stack direction="row" justifyContent="center" gap={4} flexWrap="wrap">
            <Stack direction="row" alignItems="center" gap={1}>
              <Security color="success" />
              <Typography variant="body2" color="text.secondary">Verified Hospitals</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <EmojiEvents color="primary" />
              <Typography variant="body2" color="text.secondary">International Standards</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <Schedule color="secondary" />
              <Typography variant="body2" color="text.secondary">Quick Processing</Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Enhanced Search Section */}
        <Card sx={{ mb: 6, boxShadow: 4, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
          <CardHeader 
            sx={{ 
              bgcolor: 'linear-gradient(45deg, #2196f3 30%, #9c27b0 90%)', 
              color: 'white' 
            }}
            title={
              <Stack direction="row" alignItems="center" gap={2}>
                <Search />
                <Typography variant="h5">Find Your Treatment</Typography>
              </Stack>
            }
            subheader={
              <Typography color="rgba(255,255,255,0.8)">
                Select a treatment to compare costs across different countries and see instant savings
              </Typography>
            }
          />
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={8}>
                <FormControl fullWidth>
                  <InputLabel>Choose Treatment</InputLabel>
                  <Select
                    value={selectedTreatment}
                    onChange={(e) => setSelectedTreatment(e.target.value)}
                    label="Choose Treatment"
                    sx={{ height: 56 }}
                  >
                    {Object.entries(treatmentData).map(([treatment, data]) => (
                      <MenuItem key={treatment} value={treatment}>
                        <Stack direction="row" alignItems="center" gap={2} width="100%">
                          <Chip label={data.category} size="small" variant="outlined" />
                          <Typography>{treatment}</Typography>
                          <Stack direction="row" alignItems="center" gap={0.5} ml="auto">
                            <Star sx={{ fontSize: 16, color: '#ffd700' }} />
                            <Typography variant="body2" color="text.secondary">{data.rating}</Typography>
                          </Stack>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  onClick={handleSearch}
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ 
                    height: 56,
                    background: 'linear-gradient(45deg, #2196f3 30%, #9c27b0 90%)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                  startIcon={<Calculate />}
                  endIcon={<ArrowForward />}
                >
                  Compare Costs
                </Button>
              </Grid>
            </Grid>

            {/* Popular Treatments */}
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
                Popular Treatments
              </Typography>
              <Grid container spacing={2}>
                {popularTreatments.map((treatment) => (
                  <Grid item xs={12} sm={6} md={3} key={treatment.name}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        bgcolor: treatment.bgColor,
                        border: 2,
                        borderColor: treatment.borderColor,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 4
                        }
                      }}
                      onClick={() => handleTreatmentSelect(treatment.name)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <treatment.icon sx={{ fontSize: 32, color: treatment.color, mb: 2 }} />
                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                          {treatment.name}
                        </Typography>
                        <Stack direction="row" justifyContent="center" alignItems="center" gap={0.5}>
                          <Star sx={{ fontSize: 16, color: '#ffd700' }} />
                          <Typography variant="body2" color="text.secondary">
                            {treatmentData[treatment.name].rating}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {showComparison && currentTreatment && (
          <Stack spacing={4}>
            {/* Savings Highlight */}
            <Card sx={{ 
              background: 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)', 
              color: 'white',
              boxShadow: 6
            }}>
              <CardContent sx={{ p: 5 }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={3} textAlign="center">
                    <Box position="relative" display="inline-block">
                      <TrendingDown sx={{ fontSize: 64, mb: 2 }} />
                      <Box sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        width: 24,
                        height: 24,
                        bgcolor: '#ffd700',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="caption" color="black" fontWeight="bold">!</Typography>
                      </Box>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" mb={1}>Save up to</Typography>
                    <Typography variant="h2" fontWeight="bold">{animatedPercentage}%</Typography>
                  </Grid>
                  <Grid item xs={12} md={3} textAlign="center">
                    <Typography variant="h6" mb={1}>Total Savings</Typography>
                    <Typography variant="h3" fontWeight="bold">
                      ${animatedSavings.toLocaleString()}
                    </Typography>
                    <Typography variant="body1">with Medyatra</Typography>
                  </Grid>
                  <Grid item xs={12} md={3} textAlign="center">
                    <Chip 
                      label={currentTreatment.category} 
                      sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {selectedTreatment}
                    </Typography>
                    <Typography variant="body2" mb={2}>
                      {currentTreatment.description}
                    </Typography>
                    <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                      <Schedule />
                      <Typography variant="body2">Duration: {currentTreatment.duration}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={3} textAlign="center">
                    <Stack direction="row" justifyContent="center" gap={0.5} mb={1}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} sx={{ color: '#ffd700' }} />
                      ))}
                    </Stack>
                    <Typography variant="h6" fontWeight="bold">
                      {currentTreatment.rating} Rating
                    </Typography>
                    <Typography variant="body2">Based on patient reviews</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Cost Comparison */}
            <Card sx={{ boxShadow: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
              <CardHeader
                title="Cost Comparison by Country"
                subheader="Treatment costs in USD - All prices include hospital stay and comprehensive care"
                sx={{ bgcolor: 'rgba(245,245,245,0.8)' }}
              />
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  {Object.entries(currentTreatment.costs)
                    .sort(([, a], [, b]) => a - b)
                    .map(([country, cost], index) => {
                      const isMediatra = country.includes("Medyatra")
                      const savingsFromThis = cost - medyatraCost
                      const progressValue = (cost / highestCost) * 100

                      return (
                        <Card
                          key={country}
                          sx={{
                            p: 3,
                            border: 2,
                            borderColor: isMediatra ? 'success.light' : 'grey.300',
                            bgcolor: isMediatra ? 'success.50' : 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: 3
                            }
                          }}
                        >
                          <Grid container alignItems="center" spacing={2} mb={2}>
                            <Grid item>
                              <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: index === 0 
                                  ? 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)'
                                  : index === 1
                                    ? 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)'
                                    : 'linear-gradient(45deg, #757575 30%, #424242 90%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                              }}>
                                {index + 1}
                              </Box>
                            </Grid>
                            <Grid item>
                              <Typography variant="h4" sx={{ fontSize: '2rem' }}>
                                {countryFlags[country]}
                              </Typography>
                            </Grid>
                            <Grid item xs>
                              <Typography variant="h6" fontWeight="bold">
                                {country}
                              </Typography>
                              <Stack direction="row" gap={1} mt={0.5}>
                                {isMediatra && (
                                  <Chip 
                                    icon={<CheckCircle />}
                                    label="Best Value" 
                                    color="success" 
                                    size="small"
                                  />
                                )}
                                {index === 0 && !isMediatra && (
                                  <Chip 
                                    label="Lowest Cost" 
                                    variant="outlined" 
                                    color="success" 
                                    size="small"
                                  />
                                )}
                              </Stack>
                            </Grid>
                            <Grid item textAlign="right">
                              <Typography variant="h4" fontWeight="bold">
                                ${cost.toLocaleString()}
                              </Typography>
                              {!isMediatra && savingsFromThis > 0 && (
                                <Typography variant="h6" color="success.main" fontWeight="bold">
                                  Save ${savingsFromThis.toLocaleString()}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                          <Box mb={1}>
                            <LinearProgress 
                              variant="determinate" 
                              value={progressValue} 
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: isMediatra ? 'success.100' : 'grey.200'
                              }}
                            />
                          </Box>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Relative to highest cost
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {Math.round(progressValue)}%
                            </Typography>
                          </Stack>
                        </Card>
                      )
                    })}
                </Stack>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card sx={{ 
              background: 'linear-gradient(45deg, #2196f3 30%, #9c27b0 90%)', 
              color: 'white',
              boxShadow: 6
            }}>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" mb={3}>
                  Ready to Save on Your Treatment?
                </Typography>
                <Typography variant="h6" mb={4} maxWidth="800px" mx="auto" sx={{ opacity: 0.9 }}>
                  Get world-class medical care in India with Medyatra. Our network of accredited hospitals and
                  experienced doctors ensure quality treatment at unbeatable prices.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={3} justifyContent="center">
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ 
                      borderColor: 'white', 
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': { 
                        bgcolor: 'white', 
                        color: 'primary.main',
                        borderColor: 'white'
                      }
                    }}
                    endIcon={<ArrowForward />}
                  >
                    Get Free Quote
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ 
                      borderColor: 'white', 
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': { 
                        bgcolor: 'white', 
                        color: 'primary.main',
                        borderColor: 'white'
                      }
                    }}
                  >
                    Speak to Consultant
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}

        {/* Features Section */}
        {!showComparison && (
          <Grid container spacing={4} mt={8}>
            {[
              {
                icon: Public,
                title: "Global Network",
                description: "Compare costs across 8+ countries with real-time pricing",
                color: "primary.main",
                bgColor: "primary.50",
              },
              {
                icon: Calculate,
                title: "Instant Savings",
                description: "See potential savings up to 90% with transparent pricing",
                color: "success.main",
                bgColor: "success.50",
              },
              {
                icon: Favorite,
                title: "Quality Care",
                description: "Access to internationally accredited hospitals and specialists",
                color: "error.main",
                bgColor: "error.50",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    bgcolor: feature.bgColor,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 4
                    }
                  }}
                >
                  <feature.icon sx={{ fontSize: 64, color: feature.color, mb: 3 }} />
                  <Typography variant="h5" fontWeight="bold" mb={2}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}