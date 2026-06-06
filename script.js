function sendMessage() {
  const input = document.getElementById("input");
  const chatBox = document.getElementById("chatBox");

  const text = input.value;
  if (!text) return;

  // USER MESSAGE
  const userMsg = document.createElement("div");
  userMsg.classList.add("msg", "user");
  userMsg.innerText = text;
  chatBox.appendChild(userMsg);

  input.value = "";

  // AI RESPONSE (fake for now)
  setTimeout(() => {
    const aiMsg = document.createElement("div");
    aiMsg.classList.add("msg", "ai");
    aiMsg.innerText = "SNIPPIT-AI is thinking... (backend not connected yet)";
    chatBox.appendChild(aiMsg);

    chatBox.scrollTop = chatBox.scrollHeight;
  }, 600);
}