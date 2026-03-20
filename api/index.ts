import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import os from "os";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

// Initialize Firebase Admin
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = fs.existsSync(firebaseConfigPath) 
  ? JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf-8'))
  : {};

console.log('Loaded Firebase Config Project ID:', firebaseConfig.projectId);
console.log('Loaded Firebase Config Database ID:', firebaseConfig.firestoreDatabaseId);

if (!admin.apps.length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    let serviceAccount = null;
    
    if (serviceAccountStr) {
      try {
        serviceAccount = JSON.parse(serviceAccountStr);
      } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", e);
      }
    }

    if (serviceAccount) {
      // Fix for Vercel environment variables stripping \n
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
      });
    } else {
      // Fallback to project ID only (works if ADC is available or in some environments)
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
        databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
      });
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    // Initialize with just project ID as a last resort if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({ projectId: firebaseConfig.projectId });
    }
  }
}

// Use the specific database ID if provided, otherwise use default
console.log('Initializing Firestore with Database ID:', firebaseConfig.firestoreDatabaseId || '(default)');
const db = firebaseConfig.firestoreDatabaseId 
  ? admin.firestore(firebaseConfig.firestoreDatabaseId) 
  : admin.firestore();

console.log('Firestore initialized. DB object exists:', !!db);

// Seed Menu if empty
async function seedMenuIfEmpty() {
  console.log('Starting seedMenuIfEmpty check...');
  try {
    const snapshot = await db.collection('menu').limit(1).get();
    console.log(`Menu check: snapshot.empty = ${snapshot.empty}`);
    if (snapshot.empty) {
      console.log('Menu is empty. Seeding default items...');
      // Use a more direct way to get MENU_ITEMS if possible, or just define a few basic ones
      // to ensure the app is usable even if the import fails.
      try {
        // @ts-ignore - tsx handles .ts imports
        const { MENU_ITEMS } = await import('../src/constants.ts');
        const batch = db.batch();
        for (const item of MENU_ITEMS) {
          const { id, ...itemData } = item; // Remove ID to let Firestore generate one
          const docRef = db.collection('menu').doc();
          batch.set(docRef, itemData);
        }
        await batch.commit();
        console.log('Menu seeded successfully with default items.');
      } catch (importError) {
        console.error('Failed to import MENU_ITEMS, seeding minimal menu:', importError);
        const minimalMenu = [
          { name: 'Cà phê sữa đá', basePrice: 18000, category: 'Coffee', description: 'Cà phê truyền thống' },
          { name: 'Trà đào cam sả', basePrice: 30000, category: 'Trà', description: 'Trà thanh mát' }
        ];
        const batch = db.batch();
        for (const item of minimalMenu) {
          const docRef = db.collection('menu').doc();
          batch.set(docRef, item);
        }
        await batch.commit();
      }
    } else {
      console.log(`Menu already has ${snapshot.size} items (checked with limit 1).`);
    }
  } catch (error) {
    console.error('Seed menu error:', error);
  }
}

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

function getLanIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/config", (req, res) => {
  const publicUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  res.json({
    lanIp: getLanIp(),
    port: PORT,
    publicUrl
  });
});

// Upload Image Route
app.post("/api/upload-image", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'menu_items',
    });

    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get Menu Items from Firestore
app.get("/api/menu", async (req, res) => {
  try {
    console.log('Fetching menu from collection "menu"...');
    let snapshot = await db.collection('menu').get();
    
    // Auto-seed if empty
    if (snapshot.empty) {
      console.log('Menu is empty on request. Seeding...');
      await seedMenuIfEmpty();
      snapshot = await db.collection('menu').get();
    }
    
    console.log(`Found ${snapshot.size} menu items.`);
    const menu = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(menu);
  } catch (error) {
    console.error('Fetch menu error:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Update/Add Menu Item in Firestore
app.post("/api/menu/update", async (req, res) => {
  try {
    const { id, name, basePrice, category, imageUrl, description } = req.body;
    const itemData = { name, basePrice, category, imageUrl, description };
    
    let itemId = id;
    if (!itemId) {
      const docRef = await db.collection('menu').add(itemData);
      itemId = docRef.id;
    } else {
      await db.collection('menu').doc(itemId).set(itemData, { merge: true });
    }

    res.json({ success: true, item: { id: itemId, ...itemData } });
  } catch (error) {
    console.error('Update menu error:', error);
    res.status(500).json({ error: 'Failed to update menu' });
  }
});

// Delete Menu Item from Firestore
app.post("/api/menu/delete", async (req, res) => {
  try {
    const { id } = req.body;
    await db.collection('menu').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Delete menu error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Catch-all for unknown API routes
app.all("/api/*", (req, res) => {
  console.warn(`API route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
});

async function startServer() {
  // Setup Vite middleware ONLY in local development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log('Vite middleware ready.');
      
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server listening on http://0.0.0.0:${PORT}`);
      });
    } catch (viteError) {
      console.error('Failed to setup Vite middleware:', viteError);
    }
  } else {
    // In production (Vercel), we don't serve static files from here.
    // Vercel handles static files and SPA routing via vercel.json.
    console.log('Running in production mode (Vercel).');
  }

  // Seed menu in background
  if (!process.env.VERCEL) {
    seedMenuIfEmpty().catch(err => console.error('Background seeding failed:', err));
  }
}

startServer();

export default app;
