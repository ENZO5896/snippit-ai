const API_BASE = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://snippit-ai-a005.onrender.com';

let chats = JSON.parse(localStorage.getItem("chats") || "[]");
let activeChatId = localStorage.getItem("activeChat") || null;
let currentUserName = localStorage.getItem("username") || "Enzo";

/* SAVE */
function save() {
  localStorage.setItem("chats", JSON.stringify(chats));
  localStorage.setItem("activeChat", activeChatId);
  localStorage.setItem("username", currentUserName);
}

/* ACTIVE CHAT */
function getActiveChat() {
  return chats.find(c => c.id === activeChatId);
}

/* CREATE CHAT */
function createNewChat() {
  const chat = {
    id: Date.now().toString(),
    title: "New Chat",
    messages: []
  };

  chats.unshift(chat);
  activeChatId = chat.id;

  save();
  renderSidebar();
  renderChat();
}

/* SWITCH CHAT */
function openChat(id) {
  activeChatId = id;
  save();
  renderSidebar();
  renderChat();
}

/* SIDEBAR */
function renderSidebar() {
  const box = document.getElementById("chatHistory");
  if (!box) return;

  box.innerHTML = "";

  chats.forEach(c => {
    const div = document.createElement("div");
    div.className = "side-item";
    div.textContent = c.title;

    div.onclick = () => openChat(c.id);

    box.appendChild(div);
  });
}

/* CHAT UI */
function renderChat() {
  const chatBox = document.getElementById("chat");
  const chat = getActiveChat();

  if (!chatBox || !chat) return;

  chatBox.innerHTML = "";

  chat.messages.forEach(m => {
    const div = document.createElement("div");
    div.className = "msg " + m.role;
    div.textContent = m.text;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

/* SEND MESSAGE */
async function sendMessage() {
  const input = document.getElementById("text");
  const text = input.value.trim();
  if (!text) return;

  if (!getActiveChat()) createNewChat();

  const chat = getActiveChat();

  chat.messages.push({ role: "user", text });
  input.value = "";

  renderChat();

  const typing = { role: "ai", text: "Thinking..." };
  chat.messages.push(typing);

  renderChat();

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        userName: currentUserName
      })
    });

    const data = await res.json();

    typing.text = data.reply || "No response";
  } catch (e) {
    typing.text = "Error connecting to AI";
  }

  renderChat();
  save();
}

/* SIDEBAR TOGGLE */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  sidebar.classList.toggle("open");
  overlay.style.display = sidebar.classList.contains("open") ? "block" : "none";
}

/* INIT */
window.onload = () => {
  if (chats.length === 0) createNewChat();

  renderSidebar();
  renderChat();
};