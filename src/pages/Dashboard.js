import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  Grid,
  Alert,
  useMediaQuery,
  useTheme
} from "@mui/material";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";

const NODES = [
  "node1_triage",
  "node2_extraction",
  "node3_standardization",
  "node4_formatting",
  "node5_dispatch"
];

const NODE_LABELS = {
  node1_triage: "Node 1 — Triage",
  node2_extraction: "Node 2 — Extraction",
  node3_standardization: "Node 3 — MedDRA",
  node4_formatting: "Node 4 — Format",
  node5_dispatch: "Node 5 — Dispatch"
};

const MOBILE_NODE_LABELS = {
  node1_triage: "Triage",
  node2_extraction: "Extract",
  node3_standardization: "MedDRA",
  node4_formatting: "Format",
  node5_dispatch: "Dispatch"
};

function PostCard({ post }) {
  const isDiscarded = post.triage_decision === "DISCARD";
  const isComplete = post.status === "complete";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        mb: 3,
        p: isMobile ? 0 : 1,
        border: isDiscarded
          ? "1px solid #374151"
          : isComplete
          ? "2px solid #00e67644"
          : "2px solid #00e5ff44",
        background: "#111827",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            mb: 2,
            gap: isMobile ? 1.5 : 0
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#00e5ff",
              fontWeight: 800,
              fontSize: isMobile ? "1.1rem" : "1.3rem"
            }}
          >
            {post.post_id}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              justifyContent: isMobile ? "flex-start" : "flex-end"
            }}
          >
            {post.language && (
              <Chip
                label={post.language}
                sx={{
                  background: "#7c4dff22",
                  color: "#a78bfa",
                  fontSize: isMobile ? "0.75rem" : "0.9rem",
                  fontWeight: 600,
                  px: 1
                }}
              />
            )}
            <Chip
              label={
                isDiscarded ? "🗑️ Noise" : isComplete ? "✅ Complete" : "⏳ Processing"
              }
              sx={{
                background: isDiscarded
                  ? "#37415133"
                  : isComplete
                  ? "#00e67622"
                  : "#00e5ff22",
                color: isDiscarded ? "#9ca3af" : isComplete ? "#00e676" : "#00e5ff",
                fontSize: isMobile ? "0.75rem" : "0.9rem",
                fontWeight: 700,
                px: 1
              }}
            />
            {post.confidence && (
              <Chip
                label={`${post.confidence}% confidence`}
                sx={{
                  background: post.confidence >= 75 ? "#00e67622" : "#ffd74022",
                  color: post.confidence >= 75 ? "#00e676" : "#ffd740",
                  border: `1px solid ${
                    post.confidence >= 75 ? "#00e67644" : "#ffd74044"
                  }`,
                  fontSize: isMobile ? "0.75rem" : "0.9rem",
                  fontWeight: 800,
                  px: 1
                }}
              />
            )}
            {post.review_flag === "HUMAN_REVIEW" && (
              <Chip
                label="⚠️ Human Review"
                sx={{
                  background: "#ffd74022",
                  color: "#ffd740",
                  border: "1px solid #ffd74044",
                  fontSize: isMobile ? "0.75rem" : "0.9rem",
                  fontWeight: 800,
                  px: 1
                }}
              />
            )}
          </Box>
        </Box>

        <Typography
          sx={{
            color: "#9ca3af",
            mb: 2,
            fontSize: isMobile ? "0.95rem" : "1.1rem",
            fontStyle: "italic",
            lineHeight: 1.6
          }}
        >
          "{post.raw_text}"
        </Typography>

        {!isDiscarded && (
          <>
            <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
              {NODES.map((node) => {
                const done = post.nodes_completed?.includes(node);
                return (
                  <Chip
                    key={node}
                    label={isMobile ? MOBILE_NODE_LABELS[node] : NODE_LABELS[node]}
                    sx={{
                      background: done ? "#00e67622" : "#1f2937",
                      color: done ? "#00e676" : "#4b5563",
                      border: done ? "1px solid #00e67666" : "1px solid #374151",
                      fontSize: isMobile ? "0.7rem" : "0.85rem",
                      fontWeight: 600,
                      height: isMobile ? "28px" : "32px"
                    }}
                  />
                );
              })}
            </Box>

            {post.drug_name && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 1.5 : 4,
                  background: "#1f293744",
                  p: 2,
                  borderRadius: "8px"
                }}
              >
                <Typography sx={{ color: "#9ca3af", fontSize: isMobile ? "0.95rem" : "1.1rem" }}>
                  💊 Drug:{" "}
                  <strong style={{ color: "#f9fafb", marginLeft: "8px" }}>
                    {post.drug_name}
                  </strong>
                </Typography>
                {post.meddra_term && (
                  <Typography sx={{ color: "#9ca3af", fontSize: isMobile ? "0.95rem" : "1.1rem" }}>
                    🏥 MedDRA:{" "}
                    <strong style={{ color: "#f9fafb", marginLeft: "8px" }}>
                      {post.meddra_term}
                    </strong>
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchStatus = async () => {
    try {
      const res = await axios.get(
        "https://pharmavigilance-ai-demo.onrender.com/api/pipeline-status"
      );
      setPosts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRun = async () => {
    setRunning(true);
    setMessage("🚀 Pipeline running — calling Sarvam AI...");
    setPosts([]);
    try {
      await axios.post(
        "https://pharmavigilance-ai-demo.onrender.com/api/run",
        {},
        { timeout: 180000 }
      );
      setMessage("✅ Pipeline complete! Loading results...");
      setTimeout(async () => {
        await fetchStatus();
        setRunning(false);
        setMessage("✅ Done! All posts processed.");
      }, 2000);
    } catch (e) {
      setMessage("❌ Error: " + e.message);
      setRunning(false);
    }
  };

  const submitted = posts.filter(
    (p) => p.status === "complete" && p.triage_decision !== "DISCARD"
  ).length;
  const discarded = posts.filter((p) => p.triage_decision === "DISCARD").length;

  return (
    <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: isMobile ? 2 : 4 }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 900,
          color: "#f9fafb",
          mb: 1,
          fontSize: isMobile ? "2rem" : "3rem"
        }}
      >
        Live Pipeline Monitor
      </Typography>
      <Typography sx={{ color: "#6b7280", mb: 5, fontSize: isMobile ? "1rem" : "1.2rem" }}>
        Watch multilingual ADR posts flow through all 5 nodes in real time
      </Typography>

      {/* Summary cards */}
      <Grid container spacing={isMobile ? 1.5 : 3} sx={{ mb: 6 }}>
        {[
          { label: "Total Processed", value: posts.length, color: "#00e5ff" },
          { label: "Reports Submitted", value: submitted, color: "#00e676" },
          { label: "Noise Discarded", value: discarded, color: "#6b7280" }
        ].map((stat) => (
          <Grid item xs={isMobile ? 12 : 4} key={stat.label}>
            <Card
              sx={{
                background: "#111827",
                border: "1px solid #1f2937",
                textAlign: "center",
                py: isMobile ? 2 : 4,
                px: 2
              }}
            >
              <Typography
                sx={{
                  color: stat.color,
                  fontWeight: 900,
                  fontSize: isMobile ? "2.5rem" : "4rem",
                  lineHeight: 1
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                sx={{
                  color: "#9ca3af",
                  fontSize: isMobile ? "0.9rem" : "1.1rem",
                  fontWeight: 600,
                  mt: 1,
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}
              >
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 3,
          mb: 6
        }}
      >
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon sx={{ fontSize: isMobile ? "1.5rem" : "2rem !important" }} />}
          onClick={handleRun}
          disabled={running}
          fullWidth={isMobile}
          sx={{
            py: 2,
            px: 5,
            fontSize: isMobile ? "1.1rem" : "1.2rem",
            background: "#00e5ff",
            color: "#0a0e1a",
            fontWeight: 800,
            borderRadius: "12px",
            "&:hover": { background: "#00b8d4" }
          }}
        >
          {running ? "Running..." : "Run Pipeline"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon sx={{ fontSize: isMobile ? "1.5rem" : "2rem !important" }} />}
          onClick={fetchStatus}
          fullWidth={isMobile}
          sx={{
            py: 2,
            px: 5,
            fontSize: isMobile ? "1.1rem" : "1.2rem",
            borderWidth: "2px",
            borderRadius: "12px",
            borderColor: "#374151",
            color: "#9ca3af",
            "&:hover": { borderWidth: "2px", borderColor: "#4b5563" }
          }}
        >
          Refresh
        </Button>
      </Box>

      {running && (
        <LinearProgress
          sx={{ mb: 4, height: isMobile ? 6 : 10, borderRadius: 5 }}
          color="primary"
        />
      )}

      {message && (
        <Alert
          severity={message.includes("❌") ? "error" : "success"}
          sx={{
            mb: 4,
            fontSize: isMobile ? "1rem" : "1.2rem",
            fontWeight: 600,
            borderRadius: "12px"
          }}
        >
          {message}
        </Alert>
      )}

      {/* Post cards */}
      <Box sx={{ mt: 4 }}>
        {posts.length === 0 ? (
          <Alert severity="info" sx={{ fontSize: isMobile ? "1rem" : "1.2rem" }}>
            No data yet — click "Run Pipeline" to start!
          </Alert>
        ) : (
          posts.map((post) => <PostCard key={post.post_id} post={post} />)
        )}
      </Box>
    </Box>
  );
}