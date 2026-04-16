import React, { useState } from "react";
import { Box, Typography, Button, Card, CardContent,
  Alert, Stepper, Step, StepLabel, Chip, LinearProgress } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import RestoreIcon from "@mui/icons-material/Restore";
import axios from "axios";

const steps = ["Fresh Pipeline Start", "💥 Crash at Post 005", "🟢 Recovery — Resume from Post 005"];

export default function CrashDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  const handleCrash = async () => {
    setLoading(true);
    setMessage("💥 Simulating crash at post_005...");
    setOutput("");
    try {
      const res = await axios.post("https://pharmavigilance-ai-demo.onrender.com/api/crash");
      setOutput(res.data.output);
      setActiveStep(2);
      setMessage("💥 System crashed! Posts 001-004 saved in ledger. Post 005 onwards — lost.");
    } catch (e) {
      setMessage("Error: " + e.message);
    }
    setLoading(false);
  };

  const handleRecover = async () => {
    setLoading(true);
    setMessage("🟢 Recovering from crash...");
    try {
      const res = await axios.post("https://pharmavigilance-ai-demo.onrender.com/api/recover");
      setOutput(res.data.output);
      setActiveStep(3);
      setMessage("✅ Recovery complete! System resumed exactly at post_005. Zero data lost.");
    } catch (e) {
      setMessage("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#f9fafb", mb: 0.5 }}>
        Crash & Recovery Demo
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280", mb: 3 }}>
        Demonstrate the Immutable Ledger's crash-proof recovery — the core enterprise feature
      </Typography>

      {/* Explanation card */}
      <Card sx={{ background: "#111827", border: "1px solid #7c4dff44", mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ color: "#a78bfa", fontWeight: 700, mb: 1 }}>
            🧠 How it works
          </Typography>
          <Typography variant="body2" sx={{ color: "#9ca3af", lineHeight: 1.8 }}>
            Every node writes its result to an <strong style={{ color: "#f9fafb" }}>Immutable Ledger</strong> before
            proceeding. If the system crashes mid-pipeline, restarting it checks the ledger first —
            any post already processed is <strong style={{ color: "#00e676" }}>skipped instantly</strong>,
            and the pipeline resumes exactly where it stopped.
            <br /><br />
            This means <strong style={{ color: "#ff1744" }}>zero data loss</strong> and
            <strong style={{ color: "#ff1744" }}> zero duplicate reports</strong> — a critical
            requirement in pharmaceutical regulatory compliance.
          </Typography>
        </CardContent>
      </Card>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ "& .MuiStepLabel-label": { color: "#9ca3af" } }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<BoltIcon />}
          onClick={handleCrash} disabled={loading}
          sx={{ background: "#ff1744", color: "#fff", fontWeight: 700,
            "&:hover": { background: "#d50000" } }}>
          {loading && activeStep < 2 ? "Crashing..." : "💥 Simulate Crash"}
        </Button>
        <Button variant="contained" startIcon={<RestoreIcon />}
          onClick={handleRecover} disabled={loading || activeStep < 2}
          sx={{ background: "#00e676", color: "#0a0e1a", fontWeight: 700,
            "&:hover": { background: "#00c853" } }}>
          {loading && activeStep >= 2 ? "Recovering..." : "🟢 Recover System"}
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} color="primary" />}

      {message && (
        <Alert severity={message.includes("✅") ? "success" :
          message.includes("💥") ? "error" : "info"} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* What happened explanation */}
      {activeStep >= 2 && (
        <Card sx={{ background: "#111827", border: "1px solid #1f2937", mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ color: "#ffd740", mb: 1 }}>
              📋 What just happened:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {["post_001", "post_002", "post_003", "post_004"].map((p) => (
                <Box key={p} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label={p} size="small"
                    sx={{ background: "#00e67622", color: "#00e676", fontSize: "0.7rem" }} />
                  <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                    ✅ All 5 nodes completed — safely in ledger
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip label="post_005" size="small"
                  sx={{ background: "#ff174422", color: "#ff1744", fontSize: "0.7rem" }} />
                <Typography variant="caption" sx={{ color: "#ff6b6b" }}>
                  💥 CRASH occurred here — pipeline stopped
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {activeStep >= 3 && (
        <Card sx={{ background: "#111827", border: "1px solid #00e67644", mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ color: "#00e676", mb: 1 }}>
              🟢 Recovery result:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {["post_001", "post_002", "post_003", "post_004"].map((p) => (
                <Box key={p} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label={p} size="small"
                    sx={{ background: "#37415133", color: "#6b7280", fontSize: "0.7rem" }} />
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>
                    ⏭️ Skipped — already in ledger (no duplicate processing)
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip label="post_005 onwards" size="small"
                  sx={{ background: "#00e67622", color: "#00e676", fontSize: "0.7rem" }} />
                <Typography variant="caption" sx={{ color: "#00e676" }}>
                  ✅ Resumed here — processed fresh from crash point
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Terminal output */}
      {output && (
        <Card sx={{ background: "#0a0e1a", border: "1px solid #1f2937" }}>
          <CardContent>
            <Typography variant="caption" sx={{ color: "#6b7280", mb: 1, display: "block" }}>
              Terminal Output:
            </Typography>
            <Box component="pre" sx={{ color: "#00e676", fontSize: "0.72rem",
              fontFamily: "monospace", whiteSpace: "pre-wrap", m: 0, maxHeight: 300,
              overflowY: "auto" }}>
              {output}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}