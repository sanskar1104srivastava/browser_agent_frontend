import { AccessToken } from "livekit-server-sdk";

export default async function handler(req, res) {
  try {
    const identity = "user-" + Math.floor(Math.random() * 10000);
    const roomName = "room-" + identity;

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity }
    );

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    res.status(200).json({ token, roomName });
  } catch (err) {
    res.status(500).json({ error: "Token generation failed" });
  }
}