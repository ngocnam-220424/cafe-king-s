import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import os from "os";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

const MENU_FILE = path.join(process.cwd(), 'data', 'menu.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initialize menu file if it doesn't exist
if (!fs.existsSync(MENU_FILE)) {
  fs.writeFileSync(MENU_FILE, JSON.stringify([]));
}

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

async function startServer() {
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
  app.get("/api/config", (req, res) => {
    res.json({
      lanIp: getLanIp(),
      port: PORT,
      publicUrl: process.env.APP_URL || null
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

  // Get Menu Items
  app.get("/api/menu", (req, res) => {
    try {
      const data = fs.readFileSync(MENU_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch menu' });
    }
  });

  // Update/Add Menu Item
  app.post("/api/menu/update", (req, res) => {
    try {
      const { id, name, basePrice, category, imageUrl, description } = req.body;
      const data = fs.readFileSync(MENU_FILE, 'utf-8');
      let menu = JSON.parse(data);

      const existingIndex = menu.findIndex((item: any) => item.id === id);
      const newItem = { id: id || Math.random().toString(36).substr(2, 9), name, basePrice, category, imageUrl, description };

      if (existingIndex > -1) {
        menu[existingIndex] = newItem;
      } else {
        menu.push(newItem);
      }

      fs.writeFileSync(MENU_FILE, JSON.stringify(menu, null, 2));
      res.json({ success: true, item: newItem });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update menu' });
    }
  });

  // Delete Menu Item
  app.post("/api/menu/delete", (req, res) => {
    try {
      const { id } = req.body;
      const data = fs.readFileSync(MENU_FILE, 'utf-8');
      let menu = JSON.parse(data);
      menu = menu.filter((item: any) => item.id !== id);
      fs.writeFileSync(MENU_FILE, JSON.stringify(menu, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });

  // Catch-all for unknown API routes
  app.all("/api/*", (req, res) => {
    console.warn(`API route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
