const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Beach', 'Hill Station', 'Wildlife', 'Heritage', 'Culture', 'Nature', 'Adventure', 'Temple'],
    },
    location: { type: String, required: true },
    bestSeason: { type: String, required: true },
    image: { type: String, default: '' },
    gallery: [{ type: String }],
    highlights: [{ type: String }],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
