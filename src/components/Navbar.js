import React, { useState } from "react";
import { 
  AppBar, Toolbar, Typography, Button, Box, Chip, Container, 
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText 
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import BiotechIcon from "@mui/icons-material/Biotech";
import MenuIcon from "@mui/icons-material/Menu";
import sarvam_ai_logo from "../assets/sarvam_ai_logo-removebg-preview.png";

const pages = [
  { label: "Home", path: "/" },
  { label: "Live Pipeline", path: "/pipeline" },
  { label: "ADR Reports", path: "/reports" },
  { label: "Crash Demo", path: "/crash-demo" },
  { label: "Analytics", path: "/analytics" },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile Drawer Content
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', background: "#0a0e1a", height: "100%", pt: 2 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 800, color: "#00e5ff" }}>
        Menu
      </Typography>
      <List>
        {pages.map((page) => {
          const isActive = location.pathname === page.path;
          return (
            <ListItem key={page.path} disablePadding>
              <ListItemButton 
                component={Link} 
                to={page.path} 
                sx={{ 
                  textAlign: 'center',
                  color: isActive ? "#00e5ff" : "#9ca3af",
                  background: isActive ? "rgba(0, 229, 255, 0.08)" : "transparent"
                }}
              >
                <ListItemText primary={page.label} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: "rgba(17, 24, 39, 0.7)", 
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        zIndex: 1200
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: "70px" }}>
          
          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: "#00e5ff" }}
          >
            <MenuIcon />
          </IconButton>

          {/* Brand Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                background: "rgba(0, 229, 255, 0.1)",
                borderRadius: 2,
                p: 1,
                mr: 1.5
              }}
            >
              <BiotechIcon sx={{ color: "#00e5ff", fontSize: 28 }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800, 
                mr: 2,
                fontSize: { xs: "1rem", sm: "1.25rem" }, // Smaller text on mobile
                letterSpacing: 0.5,
                background: "linear-gradient(90deg, #00e5ff 0%, #00b8d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textDecoration: "none"
              }}
              component={Link}
              to="/"
            >
              PharmaVigilance AI
            </Typography>

            {/* Snake Chip Logo - Hidden on very small screens, shown from sm up */}
            <Chip 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                  <Box 
                    component="img" 
                    src={sarvam_ai_logo} 
                    alt="Sarvam AI" 
                    sx={{ height: 22, width: "auto", objectFit: "contain" }} 
                  />
                  <span style={{ fontSize: "0.85rem", paddingTop: "2px" }}>Powered by Sarvam AI</span>
                </Box>
              }
              sx={{ 
                position: "relative",
                overflow: "hidden",
                color: "#000000", 
                fontWeight: 700,
                display: { xs: 'none', lg: 'flex' }, // Only show on large screens to save space
                background: "transparent", 
                border: "none", 
                height: "auto",
                borderRadius: "100px",
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%', left: '-50%',
                  width: '200%', height: '200%',
                  background: 'conic-gradient(from 0deg, transparent 70%, rgba(165, 0, 96, 1) 100%)',
                  animation: 'spin 2.5s linear infinite',
                  zIndex: 0,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: '2px',
                  background: "rgba(255, 255, 255, 0.95)", 
                  borderRadius: 'inherit',
                  zIndex: 0,
                },
                '& .MuiChip-label': { zIndex: 1, position: 'relative', padding: '4px 14px' },
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} 
            />
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, ml: "auto" }}>
            {pages.map((page) => {
              const isActive = location.pathname === page.path;
              return (
                <Button 
                  key={page.path} 
                  component={Link} 
                  to={page.path}
                  disableRipple
                  sx={{
                    color: isActive ? "#00e5ff" : "#9ca3af",
                    background: isActive ? "rgba(0, 229, 255, 0.08)" : "transparent",
                    borderRadius: 2, 
                    fontWeight: isActive ? 700 : 500,
                    px: 2,
                    py: 1,
                    textTransform: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: isActive ? "rgba(0, 229, 255, 0.12)" : "rgba(255, 255, 255, 0.05)",
                      color: isActive ? "#00e5ff" : "#f3f4f6"
                    }
                  }}
                >
                  {page.label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, borderRight: "1px solid rgba(0, 229, 255, 0.2)" },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}