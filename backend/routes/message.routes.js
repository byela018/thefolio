const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const router = express.Router();

// POST /api/messages — Public: send message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await Message.create({ name, email, message });
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages — Admin only: get all messages
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/messages/:id/read — Admin only: mark as read
router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    message.isRead = true;
    await message.save();
    res.json({ message: 'Marked as read', data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/messages/:id — Admin only: delete message
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    await message.deleteOne();
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;