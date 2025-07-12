import React from "react"
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material"
import LightbulbIcon from "@mui/icons-material/TipsAndUpdates"
import FavoriteIcon from "@mui/icons-material/Favorite"
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart"

export default function BlogPostContent({ slug }) {
  return (
    <Box component="article" sx={{ maxWidth: '100%', typography: 'body1' }}>
      {/* Introduction */}
      <Box id="introduction" mb={8}>
        <Typography variant="h4" gutterBottom>Introduction</Typography>
        <Typography paragraph color="text.secondary">
          Heart disease remains the leading cause of death globally, but the good news is that many forms of heart
          disease are preventable. Understanding the risk factors, recognizing early warning signs, and implementing
          effective prevention strategies can significantly reduce your risk of developing cardiovascular problems.
        </Typography>
        <Typography paragraph color="text.secondary">
          This comprehensive guide will walk you through everything you need to know about cardiac health, from
          understanding risk factors to implementing life-saving prevention strategies.
        </Typography>
      </Box>

      {/* Pro Tip Alert */}
      <Alert icon={<LightbulbIcon />} severity="info" sx={{ my: 6, backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
        <AlertTitle sx={{ color: '#1e40af' }}>
          <strong>Pro Tip:</strong> Regular cardiovascular screening starting at age 20 can help detect problems early
          when they're most treatable.
        </AlertTitle>
      </Alert>

      {/* Risk Factors */}
      <Box id="risk-factors" mb={8}>
        <Typography variant="h4" gutterBottom>Understanding Risk Factors</Typography>
        <Typography paragraph color="text.secondary">
          Heart disease risk factors fall into two main categories: those you can control and those you cannot.
          Understanding both types is crucial for developing an effective prevention strategy.
        </Typography>

        <Box id="genetic-factors" mb={6}>
          <Typography variant="h5" gutterBottom>Genetic and Uncontrollable Factors</Typography>
          <List sx={{ pl: 4 }}>
            {[
              "Family history of heart disease",
              "Age (risk increases with age)",
              "Gender (men at higher risk at younger ages)",
              "Ethnicity (some groups have higher risk)"
            ].map((text, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={text} sx={{ color: 'text.secondary' }} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box id="lifestyle-factors" mb={6}>
          <Typography variant="h5" gutterBottom>Lifestyle and Controllable Factors</Typography>
          <List sx={{ pl: 4 }}>
            {[
              "High blood pressure",
              "High cholesterol levels",
              "Smoking and tobacco use",
              "Diabetes",
              "Obesity",
              "Physical inactivity",
              "Poor diet",
              "Excessive alcohol consumption",
              "Chronic stress"
            ].map((text, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={text} sx={{ color: 'text.secondary' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Did You Know Card */}
      <Card sx={{ my: 6, backgroundColor: '#fef2f2', borderColor: '#fecaca' }} variant="outlined">
        <CardContent>
          <Box display="flex" gap={2} alignItems="flex-start">
            <FavoriteIcon sx={{ color: '#dc2626', mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#991b1b', mb: 1 }}>
                Did You Know?
              </Typography>
              <Typography sx={{ color: '#b91c1c' }}>
                About 80% of premature heart attacks and strokes are preventable through healthy lifestyle choices and
                proper medical care.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Prevention Strategies */}
      <Box id="prevention-strategies" mb={8}>
        <Typography variant="h4" gutterBottom>Evidence-Based Prevention Strategies</Typography>
        <Typography paragraph color="text.secondary">
          The most effective approach to preventing heart disease involves a combination of lifestyle modifications and,
          when necessary, medical interventions. Here are the key strategies that research has proven most effective.
        </Typography>

        <Box id="diet-exercise" mb={6}>
          <Typography variant="h5" gutterBottom>Diet and Exercise</Typography>
          <Typography paragraph color="text.secondary">
            A heart-healthy diet combined with regular physical activity forms the foundation of cardiovascular disease
            prevention.
          </Typography>

          <Box sx={{ backgroundColor: '#f9fafb', p: 2, borderRadius: 2, mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Recommended Dietary Patterns:
            </Typography>
            <List sx={{ pl: 4 }}>
              {[
                "Mediterranean diet rich in olive oil, fish, and vegetables",
                "DASH diet emphasizing fruits, vegetables, and low-fat dairy",
                "Plant-based diets with minimal processed foods"
              ].map((text, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemText primary={text} sx={{ color: 'text.secondary' }} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ backgroundColor: '#f9fafb', p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Exercise Recommendations:
            </Typography>
            <List sx={{ pl: 4 }}>
              {[
                "150 minutes of moderate-intensity aerobic activity per week",
                "75 minutes of vigorous-intensity aerobic activity per week",
                "Muscle-strengthening activities 2+ days per week"
              ].map((text, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemText primary={text} sx={{ color: 'text.secondary' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        <Box id="regular-checkups" mb={6}>
          <Typography variant="h5" gutterBottom>Regular Health Screenings</Typography>
          <Typography paragraph color="text.secondary">
            Regular monitoring of key health indicators allows for early detection and intervention.
          </Typography>

          <Grid container spacing={2}>
            {[
              { title: 'Blood Pressure', desc: 'Check annually if normal, more frequently if elevated' },
              { title: 'Cholesterol', desc: 'Every 4-6 years starting at age 20' },
              { title: 'Blood Sugar', desc: 'Every 3 years starting at age 45' },
              { title: 'BMI/Weight', desc: 'At every healthcare visit' },
            ].map((item, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Treatment Options */}
      <Box id="treatment-options" mb={8}>
        <Typography variant="h4" gutterBottom>Modern Treatment Approaches</Typography>
        <Typography paragraph color="text.secondary">
          When prevention isn't enough, modern medicine offers numerous effective treatment options for heart disease,
          ranging from medications to advanced surgical procedures.
        </Typography>

        <Alert icon={<MonitorHeartIcon />} severity="success" sx={{ my: 6, backgroundColor: '#ecfdf5', borderColor: '#bbf7d0' }}>
          <AlertTitle sx={{ color: '#065f46' }}>
            <strong>Important:</strong> Always consult with your healthcare provider before making significant changes
            to your diet, exercise routine, or medications.
          </AlertTitle>
        </Alert>
      </Box>

      {/* Conclusion */}
      <Box id="conclusion" mb={8}>
        <Typography variant="h4" gutterBottom>Taking Action for Your Heart Health</Typography>
        <Typography paragraph color="text.secondary">
          Heart disease prevention is not just about avoiding negative outcomes—it's about optimizing your overall
          health and quality of life. The strategies outlined in this guide are backed by decades of research and have
          helped millions of people maintain healthy hearts throughout their lives.
        </Typography>
        <Typography paragraph color="text.secondary">
          Remember, it's never too early or too late to start taking care of your heart. Small, consistent changes in
          your daily habits can lead to significant improvements in your cardiovascular health over time.
        </Typography>
      </Box>
    </Box>
  )
}
