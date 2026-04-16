import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Grid, Fade } from "@mui/material";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import axios from "axios";

// Slightly softened the neon colors for a more professional dashboard look
const COLORS = ["#00e5ff", "#7c4dff", "#00e676", "#ffd740", "#ff6b6b", "#f48fb1"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [prrSignals, setPrrSignals] = useState([]);
  const [trendSignals, setTrendSignals] = useState([]);
  const [executiveSummary, setExecutiveSummary] = useState("");


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

  if (!data) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Typography sx={{ color: "#9ca3af", textAlign: "center", letterSpacing: 1 }}>
        Loading analytics... (Run the pipeline first!)
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
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              mb: 1,
              background: "linear-gradient(90deg, #f9fafb 0%, #9ca3af 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "#9ca3af", letterSpacing: 0.5 }}>
            Visual breakdown of detected adverse drug reactions
          </Typography>
        </Box>

        {/* Summary numbers */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {summaryStats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Card 
                sx={{ 
                  background: "linear-gradient(145deg, rgba(31, 41, 55, 0.7) 0%, rgba(17, 24, 39, 0.9) 100%)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)", 
                  borderRadius: 4,
                  textAlign: "center", 
                  p: 3,
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 12px 40px 0 ${stat.color}25`,
                    borderColor: `${stat.color}50`
                  }
                }}
              >
                <Typography variant="h3" sx={{ color: stat.color, fontWeight: 800, mb: 1, fontFamily: "monospace" }}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Grid */}
        <Grid container spacing={4}>
          
          {/* Language breakdown */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: "#111827", 
              border: "1px solid #1f2937", 
              borderRadius: 4, 
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)" 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🌐 Language Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie 
                      data={data.languages} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value" 
                      nameKey="name"
                      stroke="none"
                    >
                      {data.languages.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: "rgba(17, 24, 39, 0.9)", border: "1px solid #374151", borderRadius: 8, color: "#fff" }} 
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Drug frequency */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: "#111827", 
              border: "1px solid #1f2937", 
              borderRadius: 4, 
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)" 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  💊 Drug Frequency
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.drugs} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "#d1d5db", fontSize: 12 }} width={90} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      contentStyle={{ background: "rgba(17, 24, 39, 0.9)", border: "1px solid #374151", borderRadius: 8, color: "#fff" }} 
                    />
                    <Bar dataKey="value" fill="#00e5ff" radius={[0, 6, 6, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Symptom frequency */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: "#111827", 
              border: "1px solid #1f2937", 
              borderRadius: 4, 
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)" 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🏥 MedDRA Symptoms
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.symptoms} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "#d1d5db", fontSize: 12 }} width={90} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      contentStyle={{ background: "rgba(17, 24, 39, 0.9)", border: "1px solid #374151", borderRadius: 8, color: "#fff" }} 
                    />
                    <Bar dataKey="value" fill="#7c4dff" radius={[0, 6, 6, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>


                      {/* Signal Intelligence Section */}

            <Grid container spacing={4} sx={{ mt: 3 }}>

              {/* PRR Signal Monitor */}

              <Grid item xs={12} md={4}>
                <Card sx={{
                  background: "#111827",
                  border: "1px solid #1f2937",
                  borderRadius: 4,
                  height: "100%"
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 700, mb: 2 }}>
                      🚨 PRR Safety Signals
                    </Typography>

                    <Typography
                      sx={{
                        color: "#9ca3af",
                        fontFamily: "monospace",
                        whiteSpace: "pre-line",
                        fontSize: "13px"
                      }}
                    >
                     {Array.isArray(prrSignals) && prrSignals.length > 0 ? (

                      prrSignals.map((signal, index) => (

                        <Card
                          key={index}
                          sx={{
                            background: "#0f172a",
                            border: "1px solid #1f2937",
                            borderRadius: 3,
                            mb: 2
                          }}
                        >

                          <CardContent>

                            <Typography variant="h6" sx={{ color: "#22c55e" }}>
                              {signal.drug}
                            </Typography>

                            <Typography sx={{ color: "#9ca3af" }}>
                              ADR: {signal.symptom}
                            </Typography>

                            <Typography sx={{ color: "#38bdf8" }}>
                              PRR Score: {signal.prr}
                            </Typography>

                            <Typography sx={{ color: "#facc15" }}>
                              Chi-Square: {signal.chi_square}
                            </Typography>

                            <Typography sx={{ color: "#ef4444", fontWeight: 700 }}>
                              🔥 {signal.alert}
                            </Typography>

                          </CardContent>

                        </Card>

                      ))

                    ) : (

                      <Typography sx={{ color: "#6b7280", fontStyle: "italic" }}>
                        No statistically significant safety signals detected yet.
                      </Typography>

                    )}
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>


              {/* Trend Velocity */}

              <Grid item xs={12} md={4}>
                <Card sx={{
                  background: "#111827",
                  border: "1px solid #1f2937",
                  borderRadius: 4,
                  height: "100%"
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 700, mb: 2 }}>
                      📈 Trend Velocity Monitor
                    </Typography>

                    {Array.isArray(trendSignals) && trendSignals.length > 0 ? (

                    <Box
                      sx={{
                        maxHeight: 320,
                        overflowY: "auto",
                        overflowX: "auto",
                        pr: 1,

                        "&::-webkit-scrollbar": {
                          width: "6px"
                        },

                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#374151",
                          borderRadius: "4px"
                        },

                        "&::-webkit-scrollbar-thumb:hover": {
                          backgroundColor: "#4b5563"
                        }
                      }}
                    >

                    <table style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      color: "#e5e7eb",
                      fontSize: "14px"
                    }}>

                    <thead>

                    <tr style={{
                      textAlign: "left",
                      borderBottom: "1px solid #374151"
                    }}>

                    <th style={{ padding: "8px" }}>Drug</th>
                    <th style={{ padding: "8px" }}>ADR</th>
                    <th style={{ padding: "8px" }}>Recent</th>
                    <th style={{ padding: "8px" }}>Velocity</th>
                    <th style={{ padding: "8px" }}>Status</th>

                    </tr>

                    </thead>

                    <tbody>

                    {trendSignals.map((trend, index) => (

                    <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #1f2937"
                    }}
                    >

                    <td style={{ padding: "8px", color: "#22c55e" }}>
                    {trend.Drug}
                    </td>

                    <td style={{ padding: "8px", color: "#9ca3af" }}>
                    {trend.Symptom}
                    </td>

                    <td style={{ padding: "8px", color: "#facc15" }}>
                    {trend["Recent (7d)"]}
                    </td>

                    <td style={{ padding: "8px", color: "#38bdf8" }}>
                    {trend["Velocity %"]}
                    </td>

                    <td style={{
                      padding: "8px",
                      color:
                        trend["Trend Status"].includes("EMERGING")
                          ? "#ef4444"
                          : "#22c55e"
                    }}
                    >
                    {trend["Trend Status"]}
                    </td>

                    </tr>

                    ))}

                    </tbody>

                    </table>

                    </Box>

                    ) : (

                    <Typography sx={{ color: "#6b7280" }}>
                    No emerging safety trends detected.
                    </Typography>

                    )}

                  </CardContent>
                </Card>
              </Grid>


              {/* Executive Summary */}

              <Grid item xs={12} md={4}>
                <Card sx={{
                  background: "#111827",
                  border: "1px solid #1f2937",
                  borderRadius: 4,
                  height: "100%"
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#f9fafb", fontWeight: 700, mb: 2 }}>
                      📄 Executive Safety Brief
                    </Typography>

                      <Box sx={{
                        background: "#0f172a",
                        borderRadius: 3,
                        padding: 3,
                        lineHeight: 1.8
                      }}>

                      {executiveSummary.split("\n").map((line, i) => (

                      <Typography key={i} sx={{ mb: 1, color: "#cbd5e1" }}>
                      {line}
                      </Typography>

                      ))}

                      </Box>

                  </CardContent>
                </Card>
              </Grid>

            </Grid>

        </Grid>
      </Box>
    </Fade>
  );
}