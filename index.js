import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// ✅ Test route for Railway
app.get("/", (req, res) => {
  res.send("OlexRavidBot is running ✅");
});

// ✅ Route to set the webhook
app.get("/set-webhook", async (req, res) => {
  try {
    const url = `${TELEGRAM_API}/setWebhook?url=https://olexravidbot-production.up.railway.app/webhook`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// ✅ Telegram will POST updates here
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Bot server running on port ${PORT}`);
});
