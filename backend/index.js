const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const pasteRoutes = require('./routes/pasteRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // ✅ MUST be BEFORE routes

app.get('/api/healthz', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/pastes', pasteRoutes); // 👈 routes AFTER json

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const Paste = require('./models/Paste');

app.get('/p/:id', async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);

    if (!paste) {
      return res.status(404).send('Paste not found');
    }

    const now = Date.now();

    if (paste.expiresAt && paste.expiresAt.getTime() <= now) {
      return res.status(404).send('Paste expired');
    }

    if (paste.maxViews !== null && paste.views >= paste.maxViews) {
      return res.status(404).send('Paste unavailable');
    }

    // ✅ COUNT THIS AS A VIEW
    paste.views += 1;
    await paste.save();

    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Paste</title>
        </head>
        <body>
          <pre>${paste.content
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</pre>
        </body>
      </html>
    `);
  } catch {
    res.status(404).send('Invalid paste');
  }
});
