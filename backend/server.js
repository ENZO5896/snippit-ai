const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("SNIPPIT-AI backend is running 🚀");
});

// CHAT ROUTE (SAFE VERSION)
app.post("/api/chat", (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    res.json({
      reply: "Backend is working. AI will be reconnected after deploy fix."
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