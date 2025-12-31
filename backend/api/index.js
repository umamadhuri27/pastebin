const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const pasteRoutes = require('./pastes');

const app = express();

app.use(cors());
app.use(express.json());

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI);
}

app.get('/api/healthz', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/pastes', pasteRoutes);

module.exports = app;
