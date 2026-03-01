import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

// Import initial data for seeding
// We'll use a simplified version of the data for seeding if the DB is empty
// In a real scenario, we'd import from src/data/services.ts, but to avoid
// circular dependencies or build issues in this environment, we'll recreate the seed logic or try to import.
// Let's try to read the file or just define the seed data here for reliability.
import { categories } from './src/data/services';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('luvia.db');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    note TEXT,
    service_id TEXT,
    service_name TEXT,
    package_name TEXT,
    package_price TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'new'
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    category_id TEXT,
    title TEXT,
    description TEXT,
    image TEXT,
    content JSON
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSON
  );
  
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT UNIQUE,
    email TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Services if empty
const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number };
if (serviceCount.count === 0) {
  console.log('Seeding services...');
  const insertService = db.prepare(`
    INSERT INTO services (id, category_id, title, description, image, content)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  categories.forEach(cat => {
    cat.items.forEach(item => {
      insertService.run(
        item.id,
        cat.id,
        item.title,
        item.description,
        item.image,
        JSON.stringify(item)
      );
    });
  });
}

// Seed Settings if empty
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('site_info', JSON.stringify({
    name: 'LUVIA',
    phone: '0899660847',
    email: 'contact@luvia.vn',
    address: 'Hồ Chí Minh, Việt Nam',
    zaloUrl: 'https://zalo.me/0899660847'
  }));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Bookings
  app.get('/api/bookings', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC');
      const bookings = stmt.all();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  app.post('/api/bookings', (req, res) => {
    try {
      const { name, phone, note, service_id, service_name, package_name, package_price } = req.body;
      
      // Create booking
      const stmt = db.prepare(`
        INSERT INTO bookings (name, phone, note, service_id, service_name, package_name, package_price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(name, phone, note, service_id, service_name, package_name, package_price);

      // Create or update customer
      const upsertCustomer = db.prepare(`
        INSERT INTO customers (name, phone) VALUES (?, ?)
        ON CONFLICT(phone) DO UPDATE SET name = excluded.name
      `);
      upsertCustomer.run(name, phone);

      res.json({ id: info.lastInsertRowid, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });

  app.patch('/api/bookings/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;
      const stmt = db.prepare('UPDATE bookings SET status = ? WHERE id = ?');
      stmt.run(status, id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  });

  // Services
  app.get('/api/services', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM services');
      const services = stmt.all().map((s: any) => ({
        ...s,
        content: JSON.parse(s.content)
      }));
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });

  app.get('/api/services/:id', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM services WHERE id = ?');
      const service = stmt.get(req.params.id) as any;
      if (service) {
        service.content = JSON.parse(service.content);
        res.json(service);
      } else {
        res.status(404).json({ error: 'Service not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch service' });
    }
  });

  app.put('/api/services/:id', (req, res) => {
    try {
      const { title, description, image, content } = req.body;
      const { id } = req.params;
      const stmt = db.prepare(`
        UPDATE services 
        SET title = ?, description = ?, image = ?, content = ?
        WHERE id = ?
      `);
      stmt.run(title, description, image, JSON.stringify(content), id);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update service' });
    }
  });

  app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the path relative to the public directory
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });

  // Customers
  app.get('/api/customers', (req, res) => {
    try {
      const stmt = db.prepare(`
        SELECT c.*, COUNT(b.id) as booking_count, SUM(CAST(REPLACE(REPLACE(b.package_price, '.', ''), '₫', '') AS INTEGER)) as total_spent
        FROM customers c
        LEFT JOIN bookings b ON c.phone = b.phone
        GROUP BY c.id
        ORDER BY created_at DESC
      `);
      const customers = stmt.all();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM settings');
      const settings = stmt.all().reduce((acc: any, curr: any) => {
        acc[curr.key] = JSON.parse(curr.value);
        return acc;
      }, {});
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.post('/api/settings', (req, res) => {
    try {
      const { key, value } = req.body;
      const stmt = db.prepare(`
        INSERT INTO settings (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `);
      stmt.run(key, JSON.stringify(value));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save settings' });
    }
  });

  // Stats
  app.get('/api/stats', (req, res) => {
    try {
      const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get() as { count: number };
      const completedBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'").get() as { count: number };
      const newBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'new'").get() as { count: number };
      
      // Mock chart data (last 7 days)
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        chartData.push({
          date: dateStr.split('-').slice(1).join('/'),
          bookings: Math.floor(Math.random() * 5) + 1,
          revenue: (Math.floor(Math.random() * 3) + 1) * 500000
        });
      }

      res.json({
        counts: {
          total: totalBookings.count,
          completed: completedBookings.count,
          new: newBookings.count,
          revenue: completedBookings.count * 1500000 
        },
        chart: chartData
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Check booking status from Airtable
  app.get('/api/check-booking/:code', async (req, res) => {
    try {
      const { code } = req.params;
      // Trim the API key to remove potential whitespace from copy-pasting
      const apiKey = process.env.AIRTABLE_ACCESS_TOKEN?.trim();
      // Force use the Base ID provided by the user to rule out env var mismatch
      const baseId = 'appRV26DyCdIiw6NY'; 
      
      console.log(`[DEBUG] Checking booking ${code}`);
      console.log(`[DEBUG] Using Base ID: ${baseId}`);
      console.log(`[DEBUG] API Key present: ${!!apiKey}`);
      
      if (!apiKey) {
        console.warn('Missing Airtable credentials (AIRTABLE_ACCESS_TOKEN)');
        return res.json({ isPaid: false, error: 'Configuration missing' });
      }

      // List of table names/IDs to try in order
      const tableCandidates = [
        'Bookings',                      // Default name (seen in screenshot)
        process.env.AIRTABLE_TABLE_NAME, // User configured
        'Table 1',                       // Common default
        'tblYgdh1K0LrYvT3j'              // ID seen in previous screenshots
      ].filter(Boolean) as string[];

      // Remove duplicates
      const uniqueTables = [...new Set(tableCandidates)];
      
      console.log(`Checking booking ${code}. Candidates: ${uniqueTables.join(', ')}`);

      let lastError;

      for (const tableName of uniqueTables) {
        try {
          const encodedTableName = encodeURIComponent(tableName);
          // Fetch recent records (increased to 100)
          // This avoids errors if the column is named 'Name', 'Code', 'Booking ID', etc.
          const url = `https://api.airtable.com/v0/${baseId}/${encodedTableName}?maxRecords=100`;
          
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${apiKey}` }
          });

          if (response.ok) {
            const data = await response.json() as { records: any[] };
            
            if (data.records.length > 0) {
                console.log(`Table '${tableName}' returned ${data.records.length} records. Fields available in first record:`, Object.keys(data.records[0].fields).join(', '));
            }

            // Search for the booking code in ANY field of the returned records (Case Insensitive)
            const foundRecord = data.records.find(record => {
              return Object.values(record.fields).some(value => 
                String(value).trim().toLowerCase() === code.trim().toLowerCase()
              );
            });

            if (foundRecord) {
              const status = foundRecord.fields.Status || foundRecord.fields.status || foundRecord.fields['Trạng thái'];
              // Check for various 'Paid' statuses (Case Insensitive)
              const statusStr = String(status).toLowerCase();
              const isPaid = 
                statusStr === 'paid' || 
                statusStr === 'đã thanh toán' || 
                statusStr === 'done' ||
                statusStr === 'hoàn thành';
                
              console.log(`Found booking ${code} in table '${tableName}'. Status: ${status}`);
              return res.json({ status, isPaid });
            } else {
              console.log(`Table '${tableName}' scanned but booking ${code} not found in recent records.`);
              // Don't return 'not_found' yet, try other tables
            }
          } else {
            if (response.status === 404) {
              console.warn(`Table '${tableName}' not found (404). Trying next...`);
              continue; // Try next table
            }
            const errorText = await response.text();
            throw new Error(`${response.status} ${response.statusText}: ${errorText}`);
          }
        } catch (error) {
          console.error(`Error checking table '${tableName}':`, error);
          lastError = error;
        }
      }

      // If we get here, not found in any table
      console.log(`Booking ${code} not found in any candidate table.`);
      return res.json({ status: 'not_found', isPaid: false });

    } catch (error) {
      console.error('Airtable check error:', error);
      res.status(500).json({ error: 'Failed to check booking status' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
