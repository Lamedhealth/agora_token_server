// server.js

// Import dependencies
const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
require("dotenv").config(); // Load environment variables

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Load Agora credentials from environment
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

// Root route to check server status
app.get("/", (req, res) => {
  res.send("✅ Agora Token Server is running!");
});

// API endpoint to generate token
app.get("/rtcToken", (req, res) => {
  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(400).json({ error: "channelName is required" });
  }

  const uid = 0; // You can make this dynamic if needed
  const role = RtcRole.PUBLISHER;
  const expireTimeSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTimestamp + expireTimeSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );

  res.json({ token });
});

// Start server on Render-compatible port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Agora token server running on port ${PORT}`);
});
