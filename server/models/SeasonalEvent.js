const mongoose = require('mongoose');

const seasonalEventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Festival', 'Cultural', 'Nature', 'Food', 'Temple', 'Monsoon'],
    },
    location: { type: String, required: true },
    season: { type: String, required: true },
    months: [{ type: String }],
    image: { type: String, default: '' },
    highlights: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SeasonalEvent', seasonalEventSchema);
