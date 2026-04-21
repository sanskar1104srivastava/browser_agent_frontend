import { AgentDispatchClient } from "livekit-server-sdk";

export default async function handler(req, res) {
  try {
    const { roomName } = req.body;

    const agentDispatch = new AgentDispatchClient(
      process.env.LIVEKIT_URL,
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    );

    await agentDispatch.createDispatch(roomName, "voice-bot");

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}