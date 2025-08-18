import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // frontend files

// Telegram Bot Setup
const TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("OlexRavidBot is running ✅");
});

// ✅ Set the webhook
app.get("/set-webhook", async (req, res) => {
  try {
    const url = `${TELEGRAM_API}/setWebhook?url=https://olexravidbot-production.up.railway.app/webhook`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// ✅ Telegram webhook handler
app.post("/webhook", async (req, res) => {
  try {
    const chatId = req.body.message.chat.id;
    const text = req.body.message.text;

    if (text === "/start") {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: "Hello 👋! OlexRavidBot is active on Railway 🚀"
      });
    } else {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: `You said: ${text}`
      });
    }

    res.send("ok");
  } catch (error) {
    console.error("Error handling webhook:", error.toString());
    res.send("error");
  }
});

// ✅ Frontend settings page
app.get("/settings", (req, res) => {
  res.sendFile("settings.html", { root: "public" });
});

// ✅ Handle settings form submission
app.post("/save-token", (req, res) => {
  const { token } = req.body || {};
  console.log("📥 Token received from settings page:", token);
  res.send(`✅ Token received: ${token}`);
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Bot server running on port ${PORT}`);
});
