const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { db } = require('../config/firebase');
const crypto = require('crypto');

// @route   GET api/clipboard
// @desc    Get all user's clipboard entries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const clipboardsSnapshot = await db.collection('clipboards')
      .where('user', '==', req.user.id)
      .orderBy('lastModified', 'desc')
      .get();

    const clipboards = [];
    clipboardsSnapshot.forEach(doc => {
      clipboards.push({ id: doc.id, ...doc.data() });
    });

    res.json(clipboards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/clipboard
// @desc    Create a new clipboard entry
// @access  Private
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, isPrivate, tags } = req.body;

    const clipboardData = {
      title,
      content,
      user: req.user.id,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      tags: tags || [],
      shareableLink: isPrivate ? null : crypto.randomBytes(10).toString('hex'),
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('clipboards').add(clipboardData);
    const clipboard = { id: docRef.id, ...clipboardData };

    res.json(clipboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/clipboard/:id
// @desc    Update a clipboard entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const clipboardRef = db.collection('clipboards').doc(req.params.id);
    const doc = await clipboardRef.get();

    if (!doc.exists) {
      return res.status(404).json({ msg: 'Clipboard not found' });
    }

    const clipboard = doc.data();
    // Make sure user owns clipboard
    if (clipboard.user !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { title, content, isPrivate, tags } = req.body;
    const clipboardFields = {
      lastModified: new Date().toISOString()
    };

    if (title) clipboardFields.title = title;
    if (content) clipboardFields.content = content;
    if (isPrivate !== undefined) {
      clipboardFields.isPrivate = isPrivate;
      if (!isPrivate && !clipboard.shareableLink) {
        clipboardFields.shareableLink = crypto.randomBytes(10).toString('hex');
      }
    }
    if (tags) clipboardFields.tags = tags;

    await clipboardRef.update(clipboardFields);
    
    const updatedDoc = await clipboardRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/clipboard/:id
// @desc    Delete a clipboard entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const clipboardRef = db.collection('clipboards').doc(req.params.id);
    const doc = await clipboardRef.get();

    if (!doc.exists) {
      return res.status(404).json({ msg: 'Clipboard not found' });
    }

    const clipboard = doc.data();
    // Make sure user owns clipboard
    if (clipboard.user !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await clipboardRef.delete();
    res.json({ msg: 'Clipboard removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/clipboard/shared/:link
// @desc    Get a shared clipboard entry by shareableLink
// @access  Public
router.get('/shared/:link', async (req, res) => {
  try {
    const clipboardsSnapshot = await db.collection('clipboards')
      .where('shareableLink', '==', req.params.link)
      .where('isPrivate', '==', false)
      .get();

    if (clipboardsSnapshot.empty) {
      return res.status(404).json({ msg: 'Shared clipboard not found' });
    }

    const doc = clipboardsSnapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 