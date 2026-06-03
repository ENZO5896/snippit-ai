let user = {};
let chats = [];
let currentChat = 0;

// LOGIN
function login() {
  let name = document.getElementById("name").value;
  let age = document.getElementById("age").value;

  if (!name || !age) {
    alert("Fill name and age");
    return;
  }

  user = { name, age };

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").classList.remove("hidden");

  createNewChat();
}

// CREATE NEW CHAT
function createNewChat() {
  let chat = { id: Date.now(), messages: [], pinned: false };
  chats.push(chat);
  currentChat = chat.id;
  renderChatList();
  renderChat();
}

// SEND MESSAGE
fetch("http://localhost:3000/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: input.value
  })
})
.then(res => res.json())
.then(data => {
  let chat = chats.find(c => c.id === currentChat);

  chat.messages.push({
    role: "bot",
    text: data.reply
  });

  saveChats();
  renderChat();
  renderChatList();
});
}
    };

    // menu actions
    div.querySelector(".menu").onclick = (e) => {
      e.stopPropagation();

      let action = prompt("Type: pin / delete / share");

      if (action === "delete") {
        chats = chats.filter(c => c.id !== chat.id);
        createNewChat();
      }

      if (action === "pin") {
        chat.pinned = !chat.pinned;
      }

      if (action === "share") {
        navigator.share?.({
          text: chat.messages.map(m => m.text).join("\n")
        });
      }

      renderChatList();
    };

    list.appendChild(div);
  });
}function generateAIResponse(text) {
  text = text.toLowerCase();

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello 👋 I'm SNIPPIT AI. How can I help you today?";
  }

  if (text.includes("name")) {
    return "I'm SNIPPIT AI, your personal assistant.";
  }

  if (text.includes("how are you")) {
    return "I'm doing great! Ready to help you build amazing things 🚀";
  }

  if (text.includes("what is snippit")) {
    return "SNIPPIT AI is your smart assistant for chatting, learning, and building ideas.";
  }

  return "I understand you. In the next update I will become fully powered AI 🤖";
}function showTyping() {
  let box = document.getElementById("chatBox");

  let typing = document.createElement("div");
  typing.id = "typing";
  typing.classList.add("typing");
  typing.innerText = "SNIPPIT is typing...";

  box.appendChild(typing);
  box.scrollTop = box.scrollHeight;
}

function hideTyping() {
  let typing = document.getElementById("typing");
  if (typing) typing.remove();
}