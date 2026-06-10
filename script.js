const API_BASE = window.location.protocol === 'file:' || window.location.hostname.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://snippit-ai-a005.onrender.com';

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
const STRIPE_PUBLISHABLE_KEY = 'pk_test_replace_with_your_publishable_key';
const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

let chats = [];
let activeChatId = null;
let currentPremium = false;
let currentUsage = { imageUploads: 0, fileUploads: 0 };
let currentLimits = { imageLimit: 3, fileLimit: 3 };
let currentTheme = localStorage.getItem('snippitTheme') || 'dark';
let currentUserName = localStorage.getItem('snippitUserName') || 'there';

function showLogin() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

function showApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('app').style.display = 'grid';
  applyTheme(currentTheme);
  renderChatList();
  loadPremiumStatus();
  loadUploads();
  updateUserChip();
  loadProfile();
}

function updateUserChip() {
  const user = auth.currentUser;
  const chip = document.getElementById('userChip');
  chip.innerText = user ? (user.displayName || user.email || 'Signed in') : 'Guest';
}

function updatePremiumBadge() {
  const badge = document.getElementById('premiumBadge');
  if (!badge) return;
  badge.innerText = currentPremium ? 'Premium Member' : 'Standard Plan';
  badge.className = `premium-badge status-badge ${currentPremium ? 'premium' : 'standard'}`;
}

auth.onAuthStateChanged(user => {
  if (user) {
    showApp();
  } else {
    showLogin();
  }
});

/* Apply saved theme on page load */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applyTheme(currentTheme));
} else {
  applyTheme(currentTheme);
}

function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => alert(err.message));
}

function emailLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) return alert('Enter email and password');
  auth.signInWithEmailAndPassword(email, password).catch(err => alert(err.message));
}

function registerWithEmail() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) return alert('Enter valid email and password');
  auth.createUserWithEmailAndPassword(email, password).catch(err => alert(err.message));
}

function logout() {
  auth.signOut();
}

function applyTheme(theme) {
  document.body.className = '';
  const root = document.documentElement;
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (theme === 'light') {
    document.body.classList.add('light-mode');
  } else if (theme === 'blue') {
    document.body.classList.add('blue-mode');
  } else if (theme === 'green') {
    document.body.classList.add('green-mode');
  } else if (theme === 'purple') {
    document.body.classList.add('purple-mode');
  }
  currentTheme = theme;
  localStorage.setItem('snippitTheme', theme);
}

function toggleThemeMenu() {
  const menu = document.getElementById('themeMenu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function setTheme(theme) {
  applyTheme(theme);
  const themeDisplay = document.getElementById('themeDisplay');
  if (themeDisplay) themeDisplay.innerText = theme.charAt(0).toUpperCase() + theme.slice(1);
  document.getElementById('themeMenu').style.display = 'none';
}

function loadProfile() {
  const nameInput = document.getElementById('userNameInput');
  if (nameInput) {
    nameInput.value = currentUserName;
  }
  const themeDisplay = document.getElementById('themeDisplay');
  if (themeDisplay) themeDisplay.innerText = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);
}

function saveProfile() {
  const nameInput = document.getElementById('userNameInput');
  if (nameInput && nameInput.value.trim()) {
    currentUserName = nameInput.value.trim();
    localStorage.setItem('snippitUserName', currentUserName);
    alert('Profile saved!');
  } else {
    alert('Please enter a name');
  }
}

function createNewChat() {
  const newChat = {
    id: Date.now().toString(),
    title: 'New chat',
    messages: [],
  };
  chats.unshift(newChat);
  activeChatId = newChat.id;
  renderChatList();
  renderActiveChat();
}

function clearConversation() {
  const chat = getActiveChat();
  if (!chat) return;
  chat.messages = [];
  renderActiveChat();
}

function getActiveChat() {
  return chats.find(chat => chat.id === activeChatId) || chats[0] || null;
}

function renderChatList() {
  const list = document.getElementById('chatHistory');
  list.innerHTML = '';
  if (chats.length === 0) {
    createNewChat();
    return;
  }
  chats.forEach(chat => {
    const item = document.createElement('div');
    item.className = 'chat-card' + (chat.id === activeChatId ? ' active' : '');
    const preview = chat.messages.slice(-1).map(m => m.text).join(' ').slice(0, 52);
    item.innerHTML = `<strong>${chat.title}</strong><p>${preview}${preview ? '…' : 'No messages yet'}</p>`;
    item.onclick = () => {
      activeChatId = chat.id;
      renderChatList();
      renderActiveChat();
    };
    list.appendChild(item);
  });
  renderActiveChat();
}

function renderActiveChat() {
  const chat = getActiveChat();
  const chatBox = document.getElementById('chatBox');
  const title = document.getElementById('chatTitle');
  const subtitle = document.getElementById('subtitle');
  if (!chat) return;
  title.innerText = chat.title || 'New conversation';
  subtitle.innerText = 'Chat with the AI, upload files, and request edits.';
  chatBox.innerHTML = '';
  chat.messages.forEach(message => {
    const messageEl = document.createElement('div');
    messageEl.className = `msg ${message.role}`;
    messageEl.innerText = message.text;
    chatBox.appendChild(messageEl);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('input');
  const text = input.value.trim();
  if (!text) return;
  let chat = getActiveChat();
  if (!chat) {
    createNewChat();
    chat = getActiveChat();
  }
  const userMessage = { role: 'user', text };
  chat.messages.push(userMessage);
  renderChatList();
  renderActiveChat();
  input.value = '';
  const typingMessage = { role: 'ai', text: 'Thinking…' };
  chat.messages.push(typingMessage);
  renderActiveChat();
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, userName: currentUserName }),
    });
    const data = await res.json();
    typingMessage.text = data.reply || 'No response from AI.';
  } catch (err) {
    typingMessage.text = 'Unable to reach backend.';
  }
  renderActiveChat();
}

async function startCheckout() {
  const user = auth.currentUser;
  if (!user) return alert('You must be logged in to purchase premium');
  const token = await user.getIdToken();
  const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({}),
  });
  const data = await res.json();
  if (!res.ok) return alert(data.error || 'Checkout creation failed');
  const result = await stripe.redirectToCheckout({ sessionId: data.id });
  if (result.error) alert(result.error.message);
}

async function redeemGiftCode() {
  const code = document.getElementById('giftCodeInput').value.trim();
  if (!code) return alert('Enter a gift code');
  const user = auth.currentUser;
  if (!user) return alert('You must be logged in to redeem a gift code');
  const token = await user.getIdToken();
  const res = await fetch(`${API_BASE}/api/redeem-gift`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) return alert(data.error || 'Gift code failed');
  alert(data.message || 'Premium activated');
  await user.getIdToken(true);
  loadPremiumStatus();
}

async function updateUsageDisplay() {
  document.getElementById('imageQuota').innerText = `Images: ${currentUsage.imageUploads} / ${currentLimits.imageLimit}`;
  document.getElementById('fileQuota').innerText = `Files: ${currentUsage.fileUploads} / ${currentLimits.fileLimit}`;
  document.getElementById('editNote').innerText = currentPremium
    ? 'Premium users can edit files and passport documents.'
    : 'Editing is available for premium users only.';
}

async function loadPremiumStatus() {
  const statusField = document.getElementById('premiumStatus');
  const user = auth.currentUser;
  if (!user) {
    statusField.innerText = 'Sign in to buy premium';
    currentPremium = false;
    currentUsage = { imageUploads: 0, fileUploads: 0 };
    currentLimits = { imageLimit: 3, fileLimit: 3 };
    updatePremiumBadge();
    updateUsageDisplay();
    return;
  }
  const token = await user.getIdToken();
  const res = await fetch(`${API_BASE}/api/premium-status`, {
    headers: { Authorization: 'Bearer ' + token },
  });
  const data = await res.json();
  if (!res.ok) {
    statusField.innerText = 'Unable to load premium status';
    return;
  }
  currentPremium = data.premium;
  currentUsage = data.usage || { imageUploads: 0, fileUploads: 0 };
  currentLimits = data.limits || { imageLimit: 3, fileLimit: 3 };
  statusField.innerText = data.premium ? 'Premium active ✅' : 'Standard user — upgrade for uploads and editing';
  updatePremiumBadge();
  updateUsageDisplay();
}

async function uploadFile() {
  const input = document.getElementById('fileInput');
  if (!input.files || !input.files.length) return alert('Select a file first');
  const file = input.files[0];
  const form = new FormData();
  form.append('file', file);
  try {
    const user = auth.currentUser;
    if (!user) return alert('You must be logged in to upload');
    const token = await user.getIdToken();
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: form,
      headers: { Authorization: 'Bearer ' + token },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    currentPremium = data.premium;
    currentUsage = data.usage || currentUsage;
    currentLimits = data.limits || currentLimits;
    updateUsageDisplay();
    alert('Uploaded: ' + data.originalName);
    loadUploads();
  } catch (err) {
    alert('Upload error: ' + err.message);
  }
}

async function loadUploads() {
  try {
    const res = await fetch(`${API_BASE}/api/uploads`);
    const data = await res.json();
    const list = document.getElementById('uploadsList');
    const sel = document.getElementById('fileSelect');
    list.innerHTML = '';
    sel.innerHTML = '<option value="">Select file to edit</option>';
    if (!data.files || !data.files.length) {
      list.innerHTML = '<div class="empty-state">No uploads yet</div>';
      return;
    }
    data.files.forEach(f => {
      const item = document.createElement('div');
      item.className = 'upload-item';
      item.innerHTML = `<a href="${f.url}" target="_blank" rel="noreferrer">${f.filename}</a>`;
      list.appendChild(item);
      const option = document.createElement('option');
      option.value = f.filename;
      option.innerText = f.filename;
      sel.appendChild(option);
    });
  } catch (err) {
    console.error(err);
    document.getElementById('uploadsList').innerHTML = '<div class="empty-state">Could not load uploads</div>';
  }
}

async function requestEdit() {
  const sel = document.getElementById('fileSelect');
  const filename = sel.value;
  const instruction = document.getElementById('editInstruction').value.trim();
  if (!filename) return alert('Select a file to edit');
  if (!instruction) return alert('Enter an instruction for the edit');
  try {
    const user = auth.currentUser;
    if (!user) return alert('You must be logged in (and a premium user) to request edits');
    const token = await user.getIdToken();
    const res = await fetch(`${API_BASE}/api/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ filename, instruction }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Edit failed');
    alert('Edit request processed: ' + (data.message || 'Done'));
    loadUploads();
  } catch (err) {
    alert('Edit error: ' + err.message);
  }
}
