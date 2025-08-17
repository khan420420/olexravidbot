import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// Read from environment (DO NOT hardcode!)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const SERVER_URL = process.env.SERVER_URL; // e.g. https://olexravidbot.onrender.com
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const PORT = process.env.PORT || 3000;

if (!TELEGRAM_TOKEN) {
  console.error("❌ TELEGRAM_TOKEN is missing. Set it in Render > Environment.");
  process.exit(1);
}

// Simple health check
app.get("/", (_req, res) => {
  res.status(200).send("OlexravidBot is running ✅");
});

// Telegram will POST updates here
app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body?.message;
    if (msg?.text && msg?.chat?.id) {
      const chatId = msg.chat.id;
      const text = msg.text.trim();

      // Basic response
      const reply = text.toLowerCase() === "/start"
        ? "Hello 👋 I'm OlexravidBot. Send me a message and I’ll echo it!"
        : `You said: ${text}`;

      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: reply
      });
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err?.response?.data || err.message);
    res.sendStatus(200); // Always 200 to Telegram
  }
});

// Optional helper to set webhook automatically (needs SERVER_URL set)
app.get("/set-webhook", async (_req, res) => {
  if (!SERVER_URL) {
    return res.status(400).send("Set SERVER_URL env var first.");
  }
  try {
    const url = `${TELEGRAM_API}/setWebhook?url=${SERVER_URL}/webhook`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (e) {
    res.status(500).json(e?.response?.data || { error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ OlexravidBot server listening on ${PORT}`);
});
