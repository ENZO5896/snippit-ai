let user = {};
let chats = [];
let currentChat = null;

// ---------------- LOGIN ----------------
function login() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  if (!name || !age) {
    alert("Fill name and age");
    return;
  }

  user = { name, age };

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").classList.remove("hidden");

  createNewChat();
}

// ---------------- CREATE CHAT ----------------
function createNewChat() {
  const chat = {
    id: Date.now(),
    messages: [],
    pinned: false
  };

  chats.push(chat);
  currentChat = chat.id;

  renderChatList();
  renderChat();
}

// ---------------- SEND MESSAGE ----------------
function sendMessage() {
  const input = document.getElementById("text"); // your HTML input id
  const message = input.value.trim();

  if (!message) return;

  const chat = chats.find(c => c.id === currentChat);
  if (!chat) return;

  // add user message
  chat.messages.push({
    role: "user",
    text: message
  });

  input.value = "";
  renderChat();
  showTyping();

  // call backend
  fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: message
    })
  })
    .then(res => res.json())
    .then(data => {
      hideTyping();

      chat.messages.push({
        role: "bot",
        text: data.reply
      });

      renderChat();
      renderChatList();
    })
    .catch(err => {
      hideTyping();
      console.error("Error:", err);
    });
}

// ---------------- RENDER CHAT ----------------
function renderChat() {
  const box = document.getElementById("chatBox");
  box.innerHTML = "";

  const chat = chats.find(c => c.id === currentChat);
  if (!chat) return;

  chat.messages.forEach(m => {
    const div = document.createElement("div");
    div.className = m.role === "user" ? "userMsg" : "botMsg";
    div.innerText = m.text;
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

// ---------------- CHAT LIST ----------------
function renderChatList() {
  const list = document.getElementById("chatList");
  if (!list) return;

  list.innerHTML = "";

  chats.forEach(chat => {
    const div = document.createElement("div");
    div.className = "chatItem";

    div.innerText = "Chat " + new Date(chat.id).toLocaleTimeString();

    div.onclick = () => {
      currentChat = chat.id;
      renderChat();
    };

    list.appendChild(div);
  });
}

// ---------------- BUTTON CONNECT ----------------
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("sendBtn");
  if (btn) {
    btn.addEventListener("click", sendMessage);
  }
});

// ---------------- TYPING ----------------
function showTyping() {
  const box = document.getElementById("chatBox");

  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "typing";
  typing.innerText = "SNIPPIT is typing...";

  box.appendChild(typing);
  box.scrollTop = box.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// ---------------- OPTIONAL AI FALLBACK ----------------
function generateAIResponse(text) {
  text = text.toLowerCase();

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello 👋 I'm SNIPPIT AI";
  }

  if (text.includes("name")) {
    return "I'm SNIPPIT AI";
  }

  return "Working on smarter responses...";
}