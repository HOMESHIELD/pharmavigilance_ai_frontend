import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import CrashDemo from "./pages/CrashDemo";
import Analytics from "./pages/Analytics";
import Landing from "./pages/landing";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00e5ff" },
    secondary: { main: "#7c4dff" },
    background: { default: "#0a0e1a", paper: "#111827" },
    success: { main: "#00e676" },
    error: { main: "#ff1744" },
    warning: { main: "#ffd740" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0a0e1a" }}>
          <Navbar />
          
          {/* Main Content Area */}
          <Box sx={{ flex: 1 }}>
            <Routes>
              {/* Set Landing as the default route */}
              <Route path="/" element={<Landing />} />
              
              {/* Moved Dashboard to /pipeline */}
              <Route path="/pipeline" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/crash-demo" element={<CrashDemo />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}