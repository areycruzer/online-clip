const mongoose = require('mongoose');

const clipboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  shareableLink: {
    type: String,
    unique: true,
    sparse: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  lastModified: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastModified on content change
clipboardSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.lastModified = Date.now();
  }
  next();
});

module.exports = mongoose.model('Clipboard', clipboardSchema); 