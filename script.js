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


// ================= AUTH STATE =================
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


// ================= EMAIL LOGIN =================
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


// ================= CHAT SYSTEM (REAL BACKEND CONNECTED) =================
async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value;
  if (!text) return;

  const chatBox = document.getElementById("chatBox");

  // show user message
  const userMsg = document.createElement("div");
  userMsg.className = "msg user";
  userMsg.innerText = text;
  chatBox.appendChild(userMsg);

  input.value = "";

  // save user message to firestore
  const user = auth.currentUser;

  if (user) {
    db.collection("chats").add({
      uid: user.uid,
      role: "user",
      message: text,
      time: Date.now()
    });
  }

  try {
    // ================= CALL YOUR BACKEND =================
    const res = await fetch("https://snippit-ai-abc123.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    // show AI response
    const aiMsg = document.createElement("div");
    aiMsg.className = "msg ai";
    aiMsg.innerText = data.reply;
    chatBox.appendChild(aiMsg);

    // save AI response
    if (user) {
      db.collection("chats").add({
        uid: user.uid,
        role: "ai",
        message: data.reply,
        time: Date.now()
      });
    }

  } catch (error) {
    console.error("Chat error:", error);

    const errMsg = document.createElement("div");
    errMsg.className = "msg ai";
    errMsg.innerText = "Error connecting to AI backend";
    chatBox.appendChild(errMsg);
  }
}