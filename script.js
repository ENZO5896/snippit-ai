let input = document.getElementById("text");
let sendBtn = document.getElementById("sendBtn");
let chatBox = document.getElementById("chatBox");

sendBtn.addEventListener("click", sendMessage);

function sendMessage() {
  let message = input.value;
  if (!message) return;

  // show user message
  addMessage(message, "user");

  input.value = "";

  showTyping();

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
      addMessage(data.reply, "bot");
    })
    .catch(() => {
      hideTyping();
      addMessage("Error getting response", "bot");
    });
}

function addMessage(text, type) {
  let div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  let typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "message bot";
  typing.innerText = "SNIPPIT is typing...";
  chatBox.appendChild(typing);
}

function hideTyping() {
  let typing = document.getElementById("typing");
  if (typing) typing.remove();
}