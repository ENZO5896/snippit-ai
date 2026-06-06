const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("SNIPPIT-AI backend is running 🚀");
});

// AI ROUTE (TEMP SAFE VERSION - NO CRASH)
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // TEMP RESPONSE (prevents crash while fixing deploy)
    res.json({
      reply: "AI backend is running. OpenAI will be connected after deploy fix."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SNIPPIT-AI running on port " + PORT);
});