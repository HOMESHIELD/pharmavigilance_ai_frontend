import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Card, CardContent, Grid, Fade, 
  useTheme, useMediaQuery, CircularProgress 
} from "@mui/material";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import axios from "axios";

// Professional dashboard neon color palette
const COLORS = ["#00e5ff", "#7c4dff", "#00e676", "#ffd740", "#ff6b6b", "#f48fb1"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [prrSignals, setPrrSignals] = useState([]);
  const [trendSignals, setTrendSignals] = useState([]);
  const [executiveSummary, setExecutiveSummary] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    axios.get("https://pharmavigilance-ai-demo.onrender.com/api/analytics")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load analytics", err));

    axios.get("https://pharmavigilance-ai-demo.onrender.com/api/signals/prr")
      .then(res => setPrrSignals(res.data))
      .catch(err => console.error("PRR failed", err));

    axios.get("https://pharmavigilance-ai-demo.onrender.com/api/signals/trends")
      .then(res => setTrendSignals(res.data))
      .catch(err => console.error("Trend failed", err));

    axios.get("https://pharmavigilance-ai-demo.onrender.com/api/signals/summary")
      .then(res => setExecutiveSummary(res.data.output))
      .catch(err => console.error("Summary failed", err));
  }, []);

  // Premium Loading State
  if (!data) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress sx={{ color: "#00e5ff", mb: 3 }} size={60} thickness={4} />
      <Typography variant="h6" sx={{ color: "#9ca3af", textAlign: "center", letterSpacing: 1, fontWeight: 600 }}>
        Aggregating live signals... 
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
        (If stuck, run the pipeline first!)
      </Typography>
    </Box>
  );

  const summaryStats = [
    { label: "Total Processed", value: data.summary.totalProcessed, color: "#00e5ff" },
    { label: "Reports Submitted", value: data.summary.totalSubmitted, color: "#00e676" },
    { label: "Noise Discarded", value: data.summary.totalDiscarded, color: "#ff6b6b" },
    { 
      label: "Detection Rate",
      value: data.summary.totalProcessed > 0
        ? Math.round((data.summary.totalSubmitted / data.summary.totalProcessed) * 100) + "%"
        : "0%",
      color: "#ffd740" 
    },
  ];

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", margin: "0 auto", pb: 10 }}>
        
        {/* ─── HEADER SECTION ─── */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              mb: 1,
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              background: "linear-gradient(90deg, #f9fafb 0%, #9ca3af 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "#9ca3af", letterSpacing: 0.5, fontSize: { xs: "1rem", md: "1.2rem" } }}>
            Visual breakdown of detected adverse drug reactions and emerging safety signals.
          </Typography>
        </Box>

        {/* ─── SUMMARY STATS ─── */}
        <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: { xs: 4, md: 6 } }}>
          {summaryStats.map((stat) => (
            <Grid item xs={6} sm={6} md={3} key={stat.label}>
              <Card 
                sx={{ 
                  background: "linear-gradient(145deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.9) 100%)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)", 
                  borderRadius: 4,
                  textAlign: "center", 
                  p: { xs: 2, md: 4 },
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 12px 40px 0 ${stat.color}30`,
                    borderColor: `${stat.color}50`
                  }
                }}
              >
                <Typography variant="h3" sx={{ color: stat.color, fontWeight: 900, mb: 1, fontFamily: "'Fira Code', monospace", fontSize: { xs: "2rem", md: "3.5rem" } }}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, fontSize: { xs: "0.7rem", md: "0.9rem" }, fontWeight: 700 }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ─── CHARTS GRID ─── */}
        <Grid container spacing={isMobile ? 3 : 4} sx={{ mb: { xs: 4, md: 6 } }}>
          
          {/* Language Breakdown */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: "linear-gradient(145deg, #111827 0%, #0a0e1a 100%)", 
              border: "1px solid #1f2937", borderRadius: 4, height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" 
            }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: "1.3rem" }}>
                  🌐 Language Dist.
                </Typography>
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
                  <PieChart>
                    <Pie 
                      data={data.languages} cx="50%" cy="50%" 
                      innerRadius={isMobile ? 50 : 70} outerRadius={isMobile ? 70 : 100}
                      paddingAngle={5} dataKey="value" nameKey="name" stroke="none"
                    >
                      {data.languages.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: "rgba(17, 24, 39, 0.95)", border: "1px solid #374151", borderRadius: 8, color: "#fff", fontWeight: 600 }} 
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "13px", color: "#9ca3af", fontWeight: 600 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Drug Frequency */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: "linear-gradient(145deg, #111827 0%, #0a0e1a 100%)", 
              border: "1px solid #1f2937", borderRadius: 4, height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" 
            }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: "1.3rem" }}>
                  💊 Drug Frequency
                </Typography>
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
                  <BarChart data={data.drugs} layout="vertical" margin={{ left: isTablet ? 10 : 20 }}>
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "#d1d5db", fontSize: 12, fontWeight: 600 }} width={isMobile ? 70 : 100} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ background: "rgba(17, 24, 39, 0.95)", border: "1px solid #374151", borderRadius: 8, color: "#fff" }} />
                    <Bar dataKey="value" fill="#00e5ff" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Symptom Frequency */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: "linear-gradient(145deg, #111827 0%, #0a0e1a 100%)", 
              border: "1px solid #1f2937", borderRadius: 4, height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" 
            }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: "1.3rem" }}>
                  🏥 MedDRA Symptoms
                </Typography>
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
                  <BarChart data={data.symptoms} layout="vertical" margin={{ left: isTablet ? 10 : 20 }}>
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "#d1d5db", fontSize: 12, fontWeight: 600 }} width={isMobile ? 80 : 120} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ background: "rgba(17, 24, 39, 0.95)", border: "1px solid #374151", borderRadius: 8, color: "#fff" }} />
                    <Bar dataKey="value" fill="#7c4dff" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>


        {/* ─── SIGNAL INTELLIGENCE SECTION ─── */}
        <Grid container spacing={isMobile ? 3 : 4}>

          {/* PRR Signal Monitor */}
          <Grid item xs={12} md={4}>
            <Card sx={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 4, height: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 800, mb: 3, fontSize: "1.4rem" }}>
                  🚨 PRR Safety Signals
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {Array.isArray(prrSignals) && prrSignals.length > 0 ? (
                    prrSignals.map((signal, index) => (
                      <Card key={index} sx={{ background: "rgba(31, 41, 55, 0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 3, transition: "transform 0.2s", "&:hover": { transform: "scale(1.02)", borderColor: "#ef444450" } }}>
                        <CardContent sx={{ p: "16px !important" }}>
                          <Typography variant="h6" sx={{ color: "#00e676", fontWeight: 800, mb: 1 }}>{signal.drug}</Typography>
                          <Typography sx={{ color: "#e5e7eb", mb: 0.5, fontWeight: 600 }}>ADR: <span style={{ color: "#9ca3af", fontWeight: 400 }}>{signal.symptom}</span></Typography>
                          <Box sx={{ display: "flex", gap: 2, mb: 1, flexWrap: "wrap" }}>
                            <Typography sx={{ color: "#38bdf8", fontSize: "0.9rem", fontWeight: 600 }}>PRR: {signal.prr}</Typography>
                            <Typography sx={{ color: "#ffd740", fontSize: "0.9rem", fontWeight: 600 }}>χ²: {signal.chi_square}</Typography>
                          </Box>
                          <Typography sx={{ color: "#ff6b6b", fontWeight: 800, fontSize: "0.95rem", mt: 1, background: "rgba(239, 68, 68, 0.1)", display: "inline-block", px: 1.5, py: 0.5, borderRadius: 1 }}>
                            🔥 {signal.alert}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Box sx={{ background: "rgba(31, 41, 55, 0.3)", p: 3, borderRadius: 3, textAlign: "center", border: "1px dashed #374151" }}>
                      <Typography sx={{ color: "#6b7280", fontStyle: "italic", fontWeight: 600 }}>
                        No statistically significant safety signals detected yet.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Trend Velocity */}
          <Grid item xs={12} md={4}>
            <Card sx={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 4, height: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 800, mb: 3, fontSize: "1.4rem" }}>
                  📈 Trend Velocity Monitor
                </Typography>

                {Array.isArray(trendSignals) && trendSignals.length > 0 ? (
                  <Box sx={{
                    maxHeight: 400, overflowY: "auto", overflowX: "auto", pr: 1,
                    "&::-webkit-scrollbar": { height: "6px", width: "6px" },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: "#374151", borderRadius: "4px" },
                  }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", color: "#e5e7eb", fontSize: isMobile ? "13px" : "15px", whiteSpace: isMobile ? "nowrap" : "normal" }}>
                      <thead>
                        <tr style={{ textAlign: "left", borderBottom: "2px solid #374151" }}>
                          <th style={{ padding: "12px 8px", color: "#9ca3af" }}>Drug</th>
                          <th style={{ padding: "12px 8px", color: "#9ca3af" }}>ADR</th>
                          <th style={{ padding: "12px 8px", color: "#9ca3af" }}>Recent</th>
                          <th style={{ padding: "12px 8px", color: "#9ca3af" }}>Velocity</th>
                          <th style={{ padding: "12px 8px", color: "#9ca3af" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trendSignals.map((trend, index) => (
                          <tr key={index} style={{ borderBottom: "1px solid #1f2937", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: "12px 8px", color: "#00e676", fontWeight: 700 }}>{trend.Drug}</td>
                            <td style={{ padding: "12px 8px", color: "#d1d5db" }}>{trend.Symptom}</td>
                            <td style={{ padding: "12px 8px", color: "#ffd740", fontWeight: 700 }}>{trend["Recent (7d)"]}</td>
                            <td style={{ padding: "12px 8px", color: "#00e5ff", fontWeight: 700 }}>{trend["Velocity %"]}</td>
                            <td style={{
                              padding: "12px 8px", fontWeight: 800,
                              color: trend["Trend Status"].includes("EMERGING") ? "#ff6b6b" : "#00e676"
                            }}>
                              {trend["Trend Status"]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                ) : (
                  <Box sx={{ background: "rgba(31, 41, 55, 0.3)", p: 3, borderRadius: 3, textAlign: "center", border: "1px dashed #374151" }}>
                    <Typography sx={{ color: "#6b7280", fontStyle: "italic", fontWeight: 600 }}>
                      No emerging safety trends detected.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Executive Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 4, height: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 800, mb: 3, fontSize: "1.4rem" }}>
                  📄 Executive Safety Brief
                </Typography>

                <Box sx={{
                  background: "linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.4))",
                  border: "1px solid rgba(0, 229, 255, 0.1)",
                  borderLeft: "4px solid #00e5ff",
                  borderRadius: 2,
                  padding: { xs: 2, md: 3 },
                  lineHeight: 1.8,
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)"
                }}>
                  {executiveSummary ? executiveSummary.split("\n").map((line, i) => (
                    <Typography key={i} sx={{ mb: 1.5, color: "#d1d5db", fontSize: { xs: "0.95rem", md: "1.05rem" } }}>
                      {line}
                    </Typography>
                  )) : (
                    <Typography sx={{ color: "#6b7280", fontStyle: "italic", textAlign: "center" }}>
                      Generating executive brief...
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>
    </Fade>
  );
}