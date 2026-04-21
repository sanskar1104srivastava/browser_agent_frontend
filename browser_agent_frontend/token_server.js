const express = require("express");
const { AccessToken, RoomServiceClient, AgentDispatchClient } = require("livekit-server-sdk");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ===== CONFIG =====
const LIVEKIT_URL = "ws://localhost:7880";
const API_KEY = "devkey";
const API_SECRET = "secret";

// ===== CLIENTS =====
const roomService = new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET);
const agentDispatch = new AgentDispatchClient(LIVEKIT_URL, API_KEY, API_SECRET);

// ===== TOKEN ENDPOINT =====
app.get("/token", async (req, res) => {
  try {
    const identity = "user-" + Math.floor(Math.random() * 10000);
    const roomName = "room-" + identity; // ✅ unique room per user

    const at = new AccessToken(API_KEY, API_SECRET, { identity });
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    console.log("✅ Generated token for:", identity, "room:", roomName);

    res.json({ token, roomName }); // ✅ send roomName to frontend
  } catch (err) {
    console.error("❌ Token error:", err);
    res.status(500).json({ error: "Token generation failed" });
  }
});

// ===== DISPATCH ENDPOINT =====
app.post("/start-agent", async (req, res) => {
  try {
    const { roomName } = req.body; // ✅ use room from frontend
    console.log("📡 Dispatching agent to room:", roomName);

    await agentDispatch.createDispatch(roomName, "voice-bot");

    console.log("🚀 Agent dispatch sent");
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Dispatch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ===== START SERVER =====
app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});