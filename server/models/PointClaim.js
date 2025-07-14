const mongoose = require('mongoose');

const pointClaimSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    default: 'Points claimed'
  }
}, {
  timestamps: true
});

// Index for better query performance
pointClaimSchema.index({ userId: 1, createdAt: -1 });
pointClaimSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PointClaim', pointClaimSchema);