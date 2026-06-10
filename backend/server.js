import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import Stripe from "stripe";

dotenv.config();

const app = express();

/* ================= CORS FIX ================= */
app.use(cors({
  origin: [
    "https://snippit-ai.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================ FILE UPLOADS ================= */
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const clean = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${unique}-${clean}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

app.use("/uploads", express.static(UPLOAD_DIR));

const USAGE_FILE = path.join(process.cwd(), "usage.json");
let usageData = {};

if (fs.existsSync(USAGE_FILE)) {
  try {
    usageData = JSON.parse(fs.readFileSync(USAGE_FILE, "utf8") || "{}");
  } catch (err) {
    console.warn('Could not parse usage.json, starting fresh:', err.message);
    usageData = {};
  }
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function ensureUsageRecord(uid) {
  if (!usageData[uid]) {
    usageData[uid] = {};
  }
  const dayKey = getTodayKey();
  if (!usageData[uid][dayKey]) {
    usageData[uid][dayKey] = {
      imageUploads: 0,
      fileUploads: 0
    };
  }
  return usageData[uid][dayKey];
}

function saveUsageData() {
  fs.writeFileSync(USAGE_FILE, JSON.stringify(usageData, null, 2));
}

function getUsageLimits(isPremium) {
  return {
    imageLimit: isPremium ? 6 : 3,
    fileLimit: isPremium ? 6 : 3
  };
}

/* ================= OPENAI SETUP ================= */
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. Chat and edit API calls will not work until it is configured.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-01"
});

const GIFT_CODES = (process.env.GIFT_CODES || "").split(",").map(code => code.trim().toUpperCase()).filter(Boolean);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const PREMIUM_PRICE_AMOUNT = Number(process.env.PREMIUM_PRICE_AMOUNT || 500);
const PREMIUM_PRICE_CURRENCY = process.env.PREMIUM_PRICE_CURRENCY || "usd";

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("SNIPPIT-AI backend is alive 🚀");
});

/* ================= CHAT API ================= */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!openai) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are SNIPPIT-AI, a smart assistant for students and entrepreneurs in Africa. Keep answers clear and helpful."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    res.status(500).json({
      error: "AI request failed"
    });
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SNIPPIT-AI running on port ${PORT}`);
});

/* ================= UPLOAD API ================= */
app.get("/api/uploads", (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR).map(f => ({
      filename: f,
      url: `${req.protocol}://${req.get("host")}/uploads/${f}`
    }));
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: "Could not list uploads" });
  }
});

/* ============== AUTH & PREMIUM CHECK ============== */
let firebaseAdminInitialized = false;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(sa) });
    firebaseAdminInitialized = true;
    console.log('Firebase admin initialized from FIREBASE_SERVICE_ACCOUNT');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
    firebaseAdminInitialized = true;
    console.log('Firebase admin initialized from GOOGLE_APPLICATION_CREDENTIALS');
  }
} catch (err) {
  console.warn('Firebase admin init failed:', err.message || err);
}

async function verifyUser(req, res, next) {
  const authHeader = req.get('Authorization') || req.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }
  const idToken = authHeader.split(' ')[1];

  if (!firebaseAdminInitialized) {
    return res.status(500).json({ error: 'Server missing Firebase admin credentials. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function isPremiumToken(decoded) {
  return decoded?.premium === true || decoded?.tier === 'premium' || (decoded?.claims && (decoded.claims.premium === true || decoded.claims.tier === 'premium'));
}

async function verifyPremium(req, res, next) {
  return verifyUser(req, res, () => {
    if (isPremiumToken(req.user)) {
      return next();
    }
    return res.status(402).json({ error: 'Premium plan required to perform this action' });
  });
}

app.post('/api/create-checkout-session', verifyUser, async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe secret key is not configured' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: PREMIUM_PRICE_CURRENCY,
            product_data: {
              name: 'SNIPPIT-AI Premium Access',
              description: 'Premium access for uploads, file editing, and document support.'
            },
            unit_amount: PREMIUM_PRICE_AMOUNT,
          },
          quantity: 1,
        }
      ],
      automatic_payment_methods: { enabled: true },
      success_url: `${req.headers.origin || CLIENT_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || CLIENT_URL}/cancel`,
      metadata: {
        firebaseUid: req.user.uid
      }
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
});

app.post('/api/redeem-gift', verifyUser, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Gift code is required' });
    }

    if (!GIFT_CODES.includes(code.trim().toUpperCase())) {
      return res.status(400).json({ error: 'Invalid gift code' });
    }

    await admin.auth().setCustomUserClaims(req.user.uid, { premium: true });

    res.json({ message: 'Gift code redeemed. Premium activated.' });
  } catch (err) {
    console.error('Gift redemption error:', err);
    res.status(500).json({ error: 'Gift redemption failed' });
  }
});

app.get('/api/premium-status', verifyUser, async (req, res) => {
  const premium = isPremiumToken(req.user);
  const usage = ensureUsageRecord(req.user.uid);
  const limits = getUsageLimits(premium);

  res.json({
    premium,
    usage,
    limits,
    remainingImageUploads: Math.max(limits.imageLimit - usage.imageUploads, 0),
    remainingFileUploads: Math.max(limits.fileLimit - usage.fileUploads, 0)
  });
});

app.get('/api/usage', verifyUser, async (req, res) => {
  const premium = isPremiumToken(req.user);
  const usage = ensureUsageRecord(req.user.uid);
  const limits = getUsageLimits(premium);

  res.json({
    premium,
    usage,
    limits,
    remainingImageUploads: Math.max(limits.imageLimit - usage.imageUploads, 0),
    remainingFileUploads: Math.max(limits.fileLimit - usage.fileUploads, 0)
  });
});

app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).send('Stripe webhook secret is not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid = session.metadata?.firebaseUid;
    if (uid) {
      try {
        await admin.auth().setCustomUserClaims(uid, { premium: true });
        console.log(`Set premium claim for user ${uid} after successful Stripe payment`);
      } catch (err) {
        console.error('Failed to set premium claim after Stripe payment:', err);
      }
    }
  }

  res.json({ received: true });
});

app.post('/api/upload', verifyUser, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const premium = isPremiumToken(req.user);
    const usage = ensureUsageRecord(req.user.uid);
    const limits = getUsageLimits(premium);
    const isImage = req.file.mimetype.startsWith('image/') || /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(req.file.originalname);
    const countKey = isImage ? 'imageUploads' : 'fileUploads';
    const limit = isImage ? limits.imageLimit : limits.fileLimit;

    if (usage[countKey] >= limit) {
      return res.status(403).json({
        error: `Daily ${isImage ? 'image' : 'file'} upload limit reached. ${premium ? 'Premium users' : 'Standard users'} can upload ${limit} ${isImage ? 'images' : 'files'} per day.`
      });
    }

    usage[countKey] += 1;
    saveUsageData();

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url,
      premium,
      usage,
      limits,
      remainingImageUploads: Math.max(limits.imageLimit - usage.imageUploads, 0),
      remainingFileUploads: Math.max(limits.fileLimit - usage.fileUploads, 0)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/api/edit', verifyPremium, async (req, res) => {
  try {
    const { filename, instruction } = req.body;
    if (!filename || !instruction) {
      return res.status(400).json({ error: 'filename and instruction are required' });
    }

    const filePath = path.join(UPLOAD_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const ext = path.extname(filename).toLowerCase();
    const textExts = new Set(['.txt', '.md', '.json', '.js', '.ts', '.py', '.html', '.css', '.java', '.csv']);

    if (!textExts.has(ext)) {
      return res.status(202).json({ message: 'Edit request received for non-text file. Manual or image-specific editing not automated yet.', filename });
    }

    const content = fs.readFileSync(filePath, 'utf8');

    const prompt = `You are a helpful editor. Apply the user's instruction to the following file content exactly and return only the full updated file content without any extra commentary.\n\nINSTRUCTION:\n${instruction}\n\nFILE CONTENT:\n${content}`;

    if (!openai) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a precise code and document editor. Return only the edited file content.' },
        { role: 'user', content: prompt }
      ]
    });

    const edited = response.choices[0].message.content;

    fs.writeFileSync(filePath, edited, 'utf8');

    res.json({ message: 'File edited', filename, url: `${req.protocol}://${req.get('host')}/uploads/${filename}` });
  } catch (err) {
    console.error('EDIT ERROR:', err);
    res.status(500).json({ error: 'Edit failed' });
  }
});