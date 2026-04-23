import React, { useState, useEffect, useRef } from "react";
import { 
  Box, Typography, Button, Container, Grid, Card, CardContent, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  useMediaQuery, useTheme 
} from "@mui/material";
import { Link } from "react-router-dom";
import BiotechIcon from "@mui/icons-material/Biotech";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TranslateIcon from "@mui/icons-material/Translate";
import StorageIcon from "@mui/icons-material/Storage";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// ─── BACKGROUND ANIMATION COMPONENT ───
const AnimatedBackground = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: -1,
      overflow: "hidden",
      background: "#0a0e1a", // Base dark color
      pointerEvents: "none", // Ensures you can click buttons over it
    }}
  >
    {/* High-tech subtle grid */}
    <Box 
      sx={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 100%)",
      }}
    />
    {/* Floating Cyan Orb */}
    <Box
      sx={{
        position: "absolute",
        top: "-10%",
        left: "-10%",
        width: "50vw",
        height: "50vw",
        background: "radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, rgba(0,0,0,0) 70%)",
        borderRadius: "50%",
        animation: "drift1 25s infinite alternate ease-in-out",
        "@keyframes drift1": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(15vw, 15vh) scale(1.3)" }
        }
      }}
    />
    {/* Floating Purple Orb */}
    <Box
      sx={{
        position: "absolute",
        bottom: "-20%",
        right: "-10%",
        width: "60vw",
        height: "60vw",
        background: "radial-gradient(circle, rgba(124, 77, 255, 0.08) 0%, rgba(0,0,0,0) 70%)",
        borderRadius: "50%",
        animation: "drift2 30s infinite alternate ease-in-out",
        "@keyframes drift2": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(-20vw, -10vh) scale(1.2)" }
        }
      }}
    />
  </Box>
);

// ─── 3D SCROLL REVEAL COMPONENT ───
const ScrollReveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      { threshold: 0.15 } // Triggers when 15% of the item is visible
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <Box
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? "translateY(0) scale(1) rotateX(0deg)" 
          : "translateY(60px) scale(0.9) rotateX(-15deg)",
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}s`,
        perspective: "1000px",
        willChange: "opacity, transform",
        position: "relative",
        zIndex: 1 // Keeps content above the animated background
      }}
    >
      {children}
    </Box>
  );
};

// ─── ANIMATIONS ───
const float = {
  "@keyframes floating": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" },
    "100%": { transform: "translateY(0px)" }
  },
  animation: "floating 4s ease-in-out infinite"
};

const pulseBorder = {
  "@keyframes pulsing": {
    "0%": { boxShadow: "0 0 0 0 rgba(0, 229, 255, 0.4)" },
    "70%": { boxShadow: "0 0 0 10px rgba(0, 229, 255, 0)" },
    "100%": { boxShadow: "0 0 0 0 rgba(0, 229, 255, 0)" }
  },
  animation: "pulsing 2s infinite"
};

// ─── DATA FROM PRESENTATION ───
const coreInnovations = [
  {
    icon: <TranslateIcon sx={{ fontSize: { xs: 40, md: 50 }, color: "#00e5ff" }} />,
    title: "Multilingual NLP",
    description: "Natively understands Indian languages and code-mixed text (Hinglish, Manglish) via Sarvam AI, breaking language barriers in healthcare.",
  },
  {
    icon: <StorageIcon sx={{ fontSize: { xs: 40, md: 50 }, color: "#7c4dff" }} />,
    title: "Crash-Safe Architecture",
    description: "Dual-database design (MongoDB Atlas + SQLite WAL) ensures zero data loss. The pipeline resumes exactly where it crashed.",
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: { xs: 40, md: 50 }, color: "#00e676" }} />,
    title: "Signal Detection Engine",
    description: "Mathematically detects emerging risks using the FDA-standard Proportional Reporting Ratio (PRR) and Chi-square validation.",
  },
  {
    icon: <BiotechIcon sx={{ fontSize: { xs: 40, md: 50 }, color: "#ff4081" }} />,
    title: "Biomedical Mapping",
    description: "BioBERT semantic matching standardizes colloquial, messy symptoms directly into official MedDRA regulatory terminology.",
  },
  {
    icon: <SpeedIcon sx={{ fontSize: { xs: 40, md: 50 }, color: "#ffd740" }} />,
    title: "Async Scalability",
    description: "Celery + Redis message brokers decouple data fetching from AI processing, preventing API timeouts and system freezes.",
  },
  {
    icon: <TimelineIcon sx={{ fontSize: { xs: 40, md: 50 }, color: "#ff6b6b" }} />,
    title: "Predictive Trends",
    description: "Velocity tracking compares recent report spikes against historical baselines, generating automated clinical executive briefings.",
  }
];

const tableData = [
  { feature: "Data Source", student: "Static Kaggle CSVs", enterprise: "Live OpenFDA + Apify Cloud Scraping via n8n" },
  { feature: "Processing", student: "Synchronous (Freezes easily)", enterprise: "Asynchronous (Celery + Redis Queues)" },
  { feature: "Storage", student: "Fragile JSON files", enterprise: "MongoDB Atlas (Data) + SQLite WAL (Ledger)" },
  { feature: "NLP & Mapping", student: "English-only Keyword Match", enterprise: "Multilingual Sarvam AI + BioBERT Semantic" },
  { feature: "Analytics", student: "Simple Counting", enterprise: "PRR + Chi-square + Velocity Metrics" },
];

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ADDED FIX: Forces browser to start at the top on refresh
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    // ADDED FIX: Increased pt from { xs: 6, md: 10 } to { xs: 12, md: 16 } to clear the Navbar
    <Box sx={{ minHeight: "100vh", color: "#f9fafb", pt: { xs: 12, md: 16 }, pb: { xs: 6, md: 10 }, overflowX: "hidden", position: "relative" }}>
      
      {/* Dynamic Animated Background */}
      <AnimatedBackground />
      
      {/* ─── HERO SECTION ─── */}
      <ScrollReveal>
        <Container maxWidth="lg" sx={{ textAlign: "center", mb: { xs: 8, md: 15 } }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 229, 255, 0.1)", borderRadius: "50%", p: 2, mb: 3, ...float }}>
            <BiotechIcon sx={{ fontSize: { xs: 50, md: 60 }, color: "#00e5ff" }} />
          </Box>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              mb: 3,
              fontSize: { xs: "2.5rem", md: "4.5rem" },
              background: "linear-gradient(90deg, #f9fafb 0%, #9ca3af 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em"
            }}
          >
            The Future of <span style={{ color: "#00e5ff", WebkitTextFillColor: "#00e5ff" }}>Pharmacovigilance</span>
          </Typography>
          <Typography variant="h6" sx={{ color: "#9ca3af", maxWidth: "800px", margin: "0 auto", mb: 5, fontWeight: 400, lineHeight: 1.6, px: { xs: 2, md: 0 }, fontSize: { xs: "1rem", md: "1.25rem" } }}>
            Automate adverse drug reaction detection, filter the noise, and standardize global medical data instantly with our cutting-edge AI pipeline.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, justifyContent: "center", px: { xs: 2, md: 0 } }}>
            <Button 
              component={Link}
              to="/pipeline"
              variant="contained" 
              endIcon={<ArrowForwardIcon />}
              fullWidth={isMobile}
              sx={{ 
                background: "linear-gradient(90deg, #00e5ff 0%, #00b8d4 100%)", 
                color: "#0a0e1a", 
                fontWeight: 800,
                px: 4, py: 1.5,
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
              fullWidth={isMobile}
              sx={{ 
                borderColor: "rgba(255,255,255,0.2)", 
                color: "#f9fafb",
                px: 4, py: 1.5,
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
      </ScrollReveal>

      {/* ─── THE CRISIS SECTION ─── */}
      <Container maxWidth="lg" sx={{ mb: { xs: 10, md: 15 } }}>
        <ScrollReveal delay={0.1}>
          <Box sx={{ background: "linear-gradient(145deg, rgba(17,24,39,0.8) 0%, rgba(10,14,26,0.9) 100%)", backdropFilter: "blur(10px)", borderRadius: 4, p: { xs: 3, md: 6 }, border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography sx={{ color: "#00e5ff", fontWeight: 700, mb: 1, letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.9rem" }}>The Crisis</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: "2rem", md: "2.5rem" } }}>
                  Post-Market Surveillance is <span style={{ color: "#ff6b6b" }}>Broken.</span>
                </Typography>
                <Typography sx={{ color: "#9ca3af", mb: 2, fontSize: "1.1rem", lineHeight: 1.6 }}>
                  Healthcare regulators rely heavily on manual reporting. This creates severe language barriers, delayed detection of emerging risks, and systems that crash under unstructured social media data loads.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: "#f9fafb", fontSize: "1.2rem" }}>The Pipeline Solution</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {["Ingest social media via Apify & n8n", "Translate & Extract via Sarvam AI", "Standardize to MedDRA via BioBERT", "Calculate PRR Statistical Signals"].map((text, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <CheckCircleOutlineIcon sx={{ color: "#00e676" }} />
                          <Typography sx={{ color: "#d1d5db" }}>{text}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </ScrollReveal>
      </Container>

      {/* ─── CORE INNOVATIONS ─── */}
      <Container maxWidth="lg" sx={{ mb: { xs: 10, md: 15 } }}>
        <ScrollReveal>
          <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 900, mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}>
            Enterprise-Grade <span style={{ color: "#00e5ff" }}>Architecture</span>
          </Typography>
          <Typography sx={{ textAlign: "center", color: "#9ca3af", mb: 8, fontSize: "1.1rem", maxWidth: "700px", mx: "auto" }}>
            Built for fault tolerance, scalability, and clinical accuracy.
          </Typography>
        </ScrollReveal>

        <Grid container spacing={isMobile ? 3 : 4}>
          {coreInnovations.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ScrollReveal delay={isMobile ? 0 : index * 0.15}>
                <Card 
                  sx={{ 
                    height: "100%",
                    background: "linear-gradient(145deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0.8) 100%)", 
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)", 
                    borderRadius: 4,
                    p: { xs: 2, md: 3 },
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "&:hover": {
                      transform: "translateY(-10px) scale(1.02)",
                      borderColor: "rgba(0, 229, 255, 0.3)",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)"
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: "#f9fafb", fontSize: { xs: "1.3rem", md: "1.5rem" } }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#9ca3af", lineHeight: 1.6, fontSize: "1rem" }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ─── TABLE SECTION ─── */}
      <Container maxWidth="lg" sx={{ mb: { xs: 10, md: 15 } }}>
        <ScrollReveal>
          <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 900, mb: 6, fontSize: { xs: "2rem", md: "3rem" } }}>
            Why This Stands Out
          </Typography>
          <TableContainer component={Paper} sx={{ background: "rgba(17, 24, 39, 0.8)", backdropFilter: "blur(10px)", border: "1px solid #1f2937", borderRadius: 4, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow sx={{ background: "rgba(0, 229, 255, 0.05)" }}>
                  <TableCell sx={{ color: "#9ca3af", fontWeight: 700, borderBottom: "1px solid #1f2937", fontSize: "1.1rem" }}>Feature</TableCell>
                  <TableCell sx={{ color: "#9ca3af", fontWeight: 700, borderBottom: "1px solid #1f2937", fontSize: "1.1rem" }}>Typical Student Project</TableCell>
                  <TableCell sx={{ color: "#00e5ff", fontWeight: 800, borderBottom: "1px solid #1f2937", fontSize: "1.1rem", ...pulseBorder, borderRadius: 1 }}>This Enterprise Project</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { background: "rgba(255,255,255,0.02)" } }}>
                    <TableCell component="th" scope="row" sx={{ color: "#f9fafb", borderBottom: "1px solid #1f2937", fontWeight: 600 }}>
                      {row.feature}
                    </TableCell>
                    <TableCell sx={{ color: "#6b7280", borderBottom: "1px solid #1f2937" }}>{row.student}</TableCell>
                    <TableCell sx={{ color: "#e5e7eb", borderBottom: "1px solid #1f2937", fontWeight: 600, background: "rgba(0, 229, 255, 0.02)" }}>
                      {row.enterprise}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ScrollReveal>
      </Container>

      {/* ─── CTA SECTION ─── */}
      <Container maxWidth="md" sx={{ textAlign: "center", px: { xs: 2, md: 0 } }}>
        <ScrollReveal delay={0.2}>
          <Box 
            sx={{ 
              p: { xs: 4, md: 8 }, 
              borderRadius: 6, 
              background: "linear-gradient(145deg, rgba(17,24,39,0.8) 0%, rgba(31,41,55,0.9) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: "#f9fafb", fontSize: { xs: "1.8rem", md: "2.8rem" }, position: "relative", zIndex: 1 }}>
              Ready to streamline your workflow?
            </Typography>
            <Typography variant="body1" sx={{ color: "#9ca3af", mb: 5, fontSize: { xs: "1rem", md: "1.2rem" }, position: "relative", zIndex: 1 }}>
              Join leading researchers leveraging AI to make drug safety faster, smarter, and highly accurate. Catching one signal early saves countless lives.
            </Typography>
            <Button 
              component={Link}
              to="/pipeline"
              variant="contained" 
              fullWidth={isMobile}
              sx={{ 
                background: "#f9fafb", 
                color: "#0a0e1a", 
                fontWeight: 800,
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.1rem",
                position: "relative",
                zIndex: 1,
                "&:hover": { background: "#e5e7eb", transform: "scale(1.05)" },
                transition: "all 0.3s ease"
              }}
            >
              Start Analyzing Data
            </Button>
          </Box>
        </ScrollReveal>
      </Container>

    </Box>
  );
}