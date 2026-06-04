const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files from the project root
app.use(express.static(path.join(__dirname, "..")));

app.post("/api/chat", (req, res) => {
  const userMessage = req.body.message;

  res.json({
    reply: "SNIPPIT AI received: " + userMessage
  });
});

app.listen(3000, () => {
  console.log("SNIPPIT backend running on port 3000");
});