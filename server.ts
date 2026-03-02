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
    booking_code TEXT,
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
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add booking_code column if it doesn't exist (migration)
try {
  db.prepare("ALTER TABLE bookings ADD COLUMN booking_code TEXT").run();
} catch (error) {
  // Column likely already exists
}

// Helper to send Telegram message
async function sendTelegramMessage(message: string) {
  // Use provided credentials as defaults if env vars are missing
  const token = process.env.TELEGRAM_BOT_TOKEN || '8516589969:AAHWH28HpjILeaUV0nTvlluoutT4RYv1Kr4';
  const chatId = process.env.TELEGRAM_CHAT_ID || '-5099109779';
  
  if (!token || !chatId) {
    console.warn('Telegram credentials missing. Skipping notification.');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}

// ...

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 5173;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.post('/api/bookings', (req, res) => {
    try {
      const { name, phone, note, service_id, service_name, package_name, package_price, booking_code } = req.body;
      
      // Create booking
      const stmt = db.prepare(`
        INSERT INTO bookings (name, phone, note, service_id, service_name, package_name, package_price, booking_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(name, phone, note, service_id, service_name, package_name, package_price, booking_code);

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

// ...

  // Check booking status from Airtable
  app.get('/api/check-booking/:code', async (req, res) => {
    try {
      const { code } = req.params;
      // Trim the API key to remove potential whitespace from copy-pasting
      const apiKey = process.env.AIRTABLE_ACCESS_TOKEN?.trim();
      // Force use the Base ID provided by the user to rule out env var mismatch
      const baseId = 'appRV26DyCdIiw6NY'; 
      
      // ... (existing logging) ...
      
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
      
      let lastError;
      let foundStatus = null;
      let isPaid = false;

      for (const tableName of uniqueTables) {
        try {
          const encodedTableName = encodeURIComponent(tableName);
          // Fetch recent records (increased to 100)
          const url = `https://api.airtable.com/v0/${baseId}/${encodedTableName}?maxRecords=100`;
          
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${apiKey}` }
          });

          if (response.ok) {
            const data = await response.json() as { records: any[] };
            
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
              isPaid = 
                statusStr === 'paid' || 
                statusStr === 'đã thanh toán' || 
                statusStr === 'done' ||
                statusStr === 'hoàn thành';
                
              foundStatus = status;
              console.log(`Found booking ${code} in table '${tableName}'. Status: ${status}`);
              
              // --- SYNC & NOTIFY LOGIC ---
              if (isPaid) {
                // Check local DB status
                const localBooking = db.prepare('SELECT * FROM bookings WHERE booking_code = ?').get(code) as any;
                
                if (localBooking && localBooking.status !== 'paid') {
                  // Update local DB
                  db.prepare("UPDATE bookings SET status = 'paid' WHERE booking_code = ?").run(code);
                  
                  // Send Telegram Notification
                  const message = `
✅ <b>Thanh toán thành công!</b>
-------------------------
Mã đơn: <b>${code}</b>
Khách hàng: ${localBooking.name}
Dịch vụ: ${localBooking.service_name}
Số tiền: ${localBooking.package_price}
-------------------------
<i>Đã cập nhật trạng thái trên hệ thống.</i>
                  `;
                  await sendTelegramMessage(message);
                  console.log(`Updated local status and sent Telegram for ${code}`);
                }
              }
              // ---------------------------

              return res.json({ status, isPaid });
            }
          } else {
             // ... (existing error handling)
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
