const firebaseConfig = {
  apiKey: "AIzaSyDpIjP2oq2SpU-2pvtLjBkFB6-KzEl9NnI",
  authDomain: "snippit-ai.firebaseapp.com",
  projectId: "snippit-ai",
  storageBucket: "snippit-ai.firebasestorage.app",
  messagingSenderId: "143652560651",
  appId: "1:143652560651:web:2f479355701b8fd48ecc0e",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

/* ================= LOGIN ================= */
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(console.error);
}

function emailLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut();
}

/* ================= CHAT ================= */
async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value;
  if (!text) return;

  const chatBox = document.getElementById("chatBox");

  // user message
  const userMsg = document.createElement("div");
  userMsg.className = "msg user";
  userMsg.innerText = text;
  chatBox.appendChild(userMsg);

  input.value = "";

  try {
    const res = await fetch("https://snippit-ai-a005.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    const aiMsg = document.createElement("div");
    aiMsg.className = "msg ai";
    aiMsg.innerText = data.reply || "No response";
    chatBox.appendChild(aiMsg);

  } catch (err) {
    console.error(err);

    const aiMsg = document.createElement("div");
    aiMsg.className = "msg ai";
    aiMsg.innerText = "Error connecting to SNIPPIT backend";
    chatBox.appendChild(aiMsg);
  }
}