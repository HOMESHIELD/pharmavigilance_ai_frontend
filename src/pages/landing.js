import React from "react";
import { Box, Typography, Button, Container, Grid, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import BiotechIcon from "@mui/icons-material/Biotech";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40, color: "#00e5ff" }} />,
    title: "Real-Time Processing",
    description: "Analyze thousands of social media posts and medical reports in milliseconds using state-of-the-art AI.",
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 40, color: "#7c4dff" }} />,
    title: "Advanced Analytics",
    description: "Visualize MedDRA symptoms, drug frequencies, and global sentiment through intuitive, interactive dashboards.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: "#00e676" }} />,
    title: "Enterprise Security",
    description: "Bank-grade encryption and strict compliance protocols ensure your pharmacovigilance data remains entirely secure.",
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", background: "#0a0e1a", color: "#f9fafb", pt: 10, pb: 10 }}>
      
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ textAlign: "center", mb: 12 }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 229, 255, 0.1)", borderRadius: "50%", p: 2, mb: 3 }}>
          <BiotechIcon sx={{ fontSize: 60, color: "#00e5ff" }} />
        </Box>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 900, 
            mb: 3,
            background: "linear-gradient(90deg, #f9fafb 0%, #9ca3af 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em"
          }}
        >
          The Future of <span style={{ color: "#00e5ff", WebkitTextFillColor: "#00e5ff" }}>Pharmacovigilance</span>
        </Typography>
        <Typography variant="h6" sx={{ color: "#9ca3af", maxWidth: "800px", margin: "0 auto", mb: 5, fontWeight: 400, lineHeight: 1.6 }}>
          Automate adverse drug reaction detection, filter the noise, and standardize global medical data instantly with our cutting-edge AI pipeline.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button 
            component={Link}
            to="/pipeline"
            variant="contained" 
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              background: "linear-gradient(90deg, #00e5ff 0%, #00b8d4 100%)", 
              color: "#0a0e1a", 
              fontWeight: 800,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              boxShadow: "0 8px 24px rgba(0, 229, 255, 0.3)",
              "&:hover": { 
                background: "linear-gradient(90deg, #00b8d4 0%, #0097a7 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 28px rgba(0, 229, 255, 0.4)"
              },
              transition: "all 0.3s ease"
            }}
          >
            Go to Live Pipeline
          </Button>
          <Button 
            component={Link}
            to="/crash-demo"
            variant="outlined" 
            sx={{ 
              borderColor: "rgba(255,255,255,0.2)", 
              color: "#f9fafb",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
              "&:hover": {
                borderColor: "rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.05)"
              }
            }}
          >
            View Demo
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: "100%",
                  background: "linear-gradient(145deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0.8) 100%)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)", 
                  borderRadius: 4,
                  p: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: "rgba(0, 229, 255, 0.3)",
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)"
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#f9fafb" }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#9ca3af", lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Box 
          sx={{ 
            p: 6, 
            borderRadius: 6, 
            background: "linear-gradient(145deg, #111827 0%, #1f2937 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: "#f9fafb" }}>
            Ready to streamline your workflow?
          </Typography>
          <Typography variant="body1" sx={{ color: "#9ca3af", mb: 4, fontSize: "1.1rem" }}>
            Join leading researchers leveraging AI to make drug safety faster, smarter, and highly accurate.
          </Typography>
          <Button 
            component={Link}
            to="/pipeline"
            variant="contained" 
            sx={{ 
              background: "#f9fafb", 
              color: "#0a0e1a", 
              fontWeight: 800,
              px: 5,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              "&:hover": { background: "#e5e7eb" }
            }}
          >
            Start Analyzing Data
          </Button>
        </Box>
      </Container>

    </Box>
  );
}