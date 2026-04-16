import React, { useState, useEffect } from "react";
import { Box, Typography, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

export default function Reports() {
  const [autoReports, setAutoReports] = useState([]);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [activeTab, setActiveTab] = useState("automated"); 
  const [search, setSearch] = useState("");

  // --- NEW: State for the Review Modal ---
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    axios.get("https://pharmavigilance-ai-demo.onrender.com/api/reports")
      .then((res) => {
        if (res.data.success) {
          setAutoReports(res.data.auto_approved);
          setReviewQueue(res.data.needs_review);
        }
      });
  };

  // --- NEW: Handlers for Approve / Deny ---
  const handleReviewAction = async (action) => {
    try {
      // Send the decision to the backend
      await axios.post(`https://pharmavigilance-ai-demo.onrender.com/api/review/${selectedReport.post_id}`, { action });
      
      // Close modal and refresh the lists
      setModalOpen(false);
      setSelectedReport(null);
      fetchReports(); 
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  const openReviewModal = (report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const currentData = activeTab === "automated" ? autoReports : reviewQueue;

  const filtered = currentData.filter((r) =>
    r.drug_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.meddra_term?.toLowerCase().includes(search.toLowerCase()) ||
    r.post_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#f9fafb", mb: 0.5 }}>
        ADR Reports Dashboard
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280", mb: 3 }}>
        All submitted adverse drug reaction reports with MedDRA codes
      </Typography>

      {/* Tabs */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, borderBottom: '1px solid #1f2937', pb: 1 }}>
        <Button onClick={() => setActiveTab("automated")} disableRipple
          sx={{ color: activeTab === "automated" ? "#3b82f6" : "#6b7280",
            borderBottom: activeTab === "automated" ? "2px solid #3b82f6" : "2px solid transparent",
            borderRadius: 0, fontWeight: 700, textTransform: "none", fontSize: "1rem" }}>
          Auto-Submitted ({autoReports.length})
        </Button>
        <Button onClick={() => setActiveTab("review")} disableRipple
          sx={{ color: activeTab === "review" ? "#ef4444" : "#6b7280",
            borderBottom: activeTab === "review" ? "2px solid #ef4444" : "2px solid transparent",
            borderRadius: 0, fontWeight: 700, textTransform: "none", fontSize: "1rem", display: 'flex', gap: 1 }}>
          Action Required
          {reviewQueue.length > 0 && (
            <Chip label={reviewQueue.length} size="small" sx={{ background: "#ef4444", color: "white", height: 20, fontSize: "0.7rem", fontWeight: "bold" }} />
          )}
        </Button>
      </Box>

      <TextField fullWidth placeholder="Search by drug, symptom or post ID..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, "& .MuiOutlinedInput-root": { background: "#111827" } }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: "#6b7280" }} /></InputAdornment>)}}
      />

      <TableContainer component={Card} sx={{ background: "#111827", border: "1px solid #1f2937" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ "& th": { color: "#6b7280", fontWeight: 700, borderBottom: "1px solid #1f2937", background: "#0a0e1a" } }}>
              <TableCell>Post ID</TableCell>
              <TableCell>Drug</TableCell>
              <TableCell>Symptom Reported</TableCell>
              <TableCell>MedDRA Term</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((report) => (
              <TableRow key={report.post_id} sx={{ "&:hover": { background: "#1f293733" }, "& td": { borderBottom: "1px solid #1f2937", color: "#d1d5db" } }}>
                <TableCell><Chip label={report.post_id} size="small" sx={{ background: "#00e5ff22", color: "#00e5ff", fontSize: "0.7rem" }} /></TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#f9fafb !important" }}>💊 {report.drug_name}</TableCell>
                <TableCell>{report.symptom_raw}</TableCell>
                <TableCell><Chip label={report.meddra_term} size="small" sx={{ background: report.meddra_code !== "UNKNOWN" ? "#00e67622" : "#37415133", color: report.meddra_code !== "UNKNOWN" ? "#00e676" : "#6b7280" }} /></TableCell>
                <TableCell><Chip label={`${report.confidence || 'N/A'}%`} size="small" sx={{ background: (report.confidence || 0) >= 85 ? "#00e67622" : "#ffd74022", color: (report.confidence || 0) >= 85 ? "#00e676" : "#ffd740", fontSize: "0.7rem" }} /></TableCell>
                <TableCell><Chip label={activeTab === "review" ? "NEEDS REVIEW" : "APPROVED"} size="small" sx={{ background: activeTab === "review" ? "#ffd74022" : "#00e67622", color: activeTab === "review" ? "#ffd740" : "#00e676", fontSize: "0.65rem" }} /></TableCell>
                
                <TableCell>
                  {/* Show Export for Auto-approved, Show 'Review' button for Action Required */}
                  {activeTab === "automated" ? (
                    <Button variant="outlined" size="small" href={`https://pharmavigilance-ai-demo.onrender.com/api/export-e2b/${report.post_id}`} download
                      sx={{ borderColor: "#3b82f6", color: "#3b82f6", fontSize: "0.7rem", textTransform: "none" }}>
                      📄 E2B
                    </Button>
                  ) : (
                    <Button variant="contained" size="small" onClick={() => openReviewModal(report)}
                      sx={{ background: "#ffd740", color: "#111827", fontSize: "0.7rem", fontWeight: "bold", textTransform: "none", "&:hover": { background: "#ffc400" }}}>
                      🔍 Review
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── NEW: Human Review Modal ── */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { background: "#111827", border: "1px solid #1f2937", color: "#f9fafb" }}}>
        {selectedReport && (
          <>
            <DialogTitle sx={{ borderBottom: "1px solid #1f2937", fontWeight: 700 }}>
              Human Review: {selectedReport.post_id}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase" }}>Original Social Media Post</Typography>
                  <Box sx={{ p: 2, background: "#1f2937", borderRadius: 1, mt: 1, fontStyle: "italic" }}>
                    "{selectedReport.original_text || "Original text not found in ledger."}"
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase" }}>Extracted Drug</Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>💊 {selectedReport.drug_name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase" }}>Extracted Symptom</Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>{selectedReport.symptom_raw}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase" }}>MedDRA Term</Typography>
                  <Typography sx={{ color: "#00e676", fontWeight: "bold" }}>{selectedReport.meddra_term}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase" }}>Confidence Score</Typography>
                  <Typography sx={{ color: "#ffd740", fontWeight: "bold" }}>{selectedReport.confidence}%</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ borderTop: "1px solid #1f2937", p: 2, gap: 1 }}>
              <Button onClick={() => handleReviewAction("deny")} variant="outlined" color="error" sx={{ textTransform: "none", fontWeight: "bold" }}>
                Deny & Discard
              </Button>
              <Button onClick={() => handleReviewAction("approve")} variant="contained" color="success" sx={{ textTransform: "none", fontWeight: "bold" }}>
                Approve Report
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}