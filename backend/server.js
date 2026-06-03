const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", (req, res) => {
  const userMessage = req.body.message;

  res.json({
    reply: "SNIPPIT AI received: " + userMessage
  });
});

app.listen(3000, () => {
  console.log("SNIPPIT backend running on port 3000");
});