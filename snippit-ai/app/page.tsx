"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  function sendMessage() {
    if (!message.trim()) return;

    setChat([...chat, "You: " + message]);

    setMessage("");
  }

  return (
    <main style={{
      padding: 20,
      fontFamily: "Arial",
      maxWidth: 700,
      margin: "0 auto"
    }}>
      <h1>SNIPPIT AI 🚀</h1>

      {/* Chat messages */}
      <div style={{
        marginTop: 20,
        minHeight: 300,
        border: "1px solid #ddd",
        padding: 10,
        borderRadius: 8
      }}>
        {chat.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </div>

      {/* Input */}
      <div style={{ marginTop: 20 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask SNIPPIT anything..."
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            marginTop: 10,
            padding: 10,
            width: "100%",
            background: "black",
            color: "white",
            borderRadius: 8
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}