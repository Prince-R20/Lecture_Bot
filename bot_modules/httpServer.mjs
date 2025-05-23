import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("LectureBot is alive!");
});

app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});

// This is a simple HTTP server that responds with "LectureBot is alive!" when accessed
