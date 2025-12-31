const express = require('express');
const router = express.Router();
const Paste = require('../models/Paste');

const getCurrentTime = (req) => {
  if (process.env.TEST_MODE === '1') {
    const testNow = req.headers['x-test-now-ms'];
    if (testNow) {
      return Number(testNow);
    }
  }
  return Date.now();
};

// POST /api/pastes
router.post('/', async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    // 1️⃣ Validate content
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    // 2️⃣ Validate ttl_seconds
    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return res.status(400).json({ error: 'ttl_seconds must be >= 1' });
      }
    }

    // 3️⃣ Validate max_views
    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return res.status(400).json({ error: 'max_views must be >= 1' });
      }
    }

    // 4️⃣ Calculate expiry time
    let expiresAt = null;
    if (ttl_seconds) {
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    // 5️⃣ Create paste
    const paste = await Paste.create({
      content: content.trim(),
      expiresAt,
      maxViews: max_views ?? null,
    });

    // 6️⃣ Respond
    res.status(201).json({
      id: paste._id,
      url: `${req.protocol}://${req.get('host')}/p/${paste._id}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/pastes/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const paste = await Paste.findById(id);

    // 1️⃣ Paste not found
    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }

    // 2️⃣ Determine current time (TEST_MODE support later)
    const now = getCurrentTime(req);


    // 3️⃣ Check expiry
    if (paste.expiresAt && paste.expiresAt.getTime() <= now) {
      return res.status(404).json({ error: 'Paste expired' });
    }

    // 4️⃣ Check view limit
    if (paste.maxViews !== null && paste.views >= paste.maxViews) {
      return res.status(404).json({ error: 'View limit exceeded' });
    }

    // 5️⃣ Increment views
    paste.views += 1;
    await paste.save();

    // 6️⃣ Remaining views
    const remainingViews =
      paste.maxViews !== null ? paste.maxViews - paste.views : null;

    // 7️⃣ Response
    res.status(200).json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Invalid paste ID' });
  }
});


module.exports = router;
