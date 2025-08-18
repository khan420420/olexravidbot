const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = process.env.TELEGRAM_TOKEN;
const SERVER_URL = process.env.SERVER_URL;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// Root endpoint
app.get("/", (req, res) => {
  res.send("OlexravidBot is running ✅");
});

// Set Webhook endpoint
app.get("/set-webhook", async (req, res) => {
  try {
    const url = `${SERVER_URL}/webhook/${TOKEN}`;
    const response = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${url}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Telegram will send updates here
app.post(`/webhook/${TOKEN}`, (req, res) => {
  const message = req.body.message;

  if (message && message.text) {
    const chatId = message.chat.id;
    const text = message.text;

    // Echo back the same text
    axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: `You said: ${text}`,
    });
  }

  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`OlexravidBot running on port ${PORT}`);
});

