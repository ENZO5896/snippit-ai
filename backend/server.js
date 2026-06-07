import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

/* ================= CORS FIX ================= */
app.use(cors({
  origin: [
    "https://snippit-ai.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= OPENAI SETUP ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("SNIPPIT-AI backend is alive 🚀");
});

/* ================= CHAT API ================= */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are SNIPPIT-AI, a smart assistant for students and entrepreneurs in Africa. Keep answers clear and helpful."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    res.status(500).json({
      error: "AI request failed"
    });
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SNIPPIT-AI running on port ${PORT}`);
});