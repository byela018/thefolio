const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const router = express.Router();


// GET /api/comments/:postId — Public: all comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      post: req.params.postId,
      parentComment: null // only top-level comments
    })
      .populate('author', 'name profilePic')
      .sort({ createdAt: 1 });

    // fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'name profilePic')
          .sort({ createdAt: 1 });
        return { ...comment.toObject(), replies };
      })
    );

    res.json(commentsWithReplies);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/comments/:postId — Member/Admin: add comment
router.post('/:postId', protect, memberOrAdmin, async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      body: req.body.body,
      parentComment: req.body.parentComment || null,
    });
    await comment.populate('author', 'name profilePic');
    res.status(201).json(comment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/comments/:id — Own comment or admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    // delete replies too
    await Comment.deleteMany({ parentComment: req.params.id });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;