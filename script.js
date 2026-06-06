// ================= FIREBASE INIT =================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// ================= PAGE SWITCHING =================
function showApp() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "flex";
}

function showLogin() {
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("app").style.display = "none";
}


// ================= AUTH STATE (SECURITY + ANALYTICS SAFE) =================
auth.onAuthStateChanged(async (user) => {
  if (user) {

    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      email: user.email || null,
      name: user.displayName || "User",
      lastLogin: Date.now()
    }, { merge: true });

    showApp();

  } else {
    showLogin();
  }
});


// ================= GOOGLE LOGIN =================
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(async (result) => {
      const user = result.user;

      await db.collection("users").doc(user.uid).set({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        createdAt: Date.now()
      }, { merge: true });

      showApp();
    })
    .catch((error) => {
      console.error("Google login error:", error);
      alert("Google login failed");
    });
}


// ================= EMAIL LOGIN / SIGNUP =================
function emailLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => showApp())
    .catch(() => {
      auth.createUserWithEmailAndPassword(email, password)
        .then(() => showApp())
        .catch(err => alert(err.message));
    });
}


// ================= LOGOUT =================
function logout() {
  auth.signOut();
}


// ================= AI BACKEND CONNECTION (NEW FIXED PART) =================

// REAL AI CALL
async function getAIResponse(message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    return data.reply;

  } catch (error) {
    console.error("AI backend error:", error);
    return "AI is currently unavailable.";
  }
}


// ================= CHAT SYSTEM (FIXED + CONNECTED) =================
async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value;
  if (!text) return;

  const chatBox = document.getElementById("chatBox");

  // USER MESSAGE UI
  const userMsg = document.createElement("div");
  userMsg.className = "msg user";
  userMsg.innerText = text;
  chatBox.appendChild(userMsg);

  input.value = "";

  const user = auth.currentUser;

  // SAVE USER MESSAGE (FIRESTORE)
  if (user) {
    db.collection("chats").add({
      uid: user.uid,
      role: "user",
      message: text,
      time: Date.now()
    });
  }

  // AI LOADING MESSAGE
  const aiMsg = document.createElement("div");
  aiMsg.className = "msg ai";
  aiMsg.innerText = "Thinking...";
  chatBox.appendChild(aiMsg);

  // CALL REAL BACKEND
  const reply = await getAIResponse(text);

  aiMsg.innerText = reply;

  // SAVE AI RESPONSE (FIRESTORE)
  if (user) {
    db.collection("chats").add({
      uid: user.uid,
      role: "ai",
      message: reply,
      time: Date.now()
    });
  }
}