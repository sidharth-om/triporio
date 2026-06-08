const mongoose = require('mongoose');

const tripRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Trip planning answers
    numberOfPeople: { type: Number, required: true },
    numberOfDays: { type: Number, required: true },
    arrivalMode: {
      type: String,
      required: true,
      enum: ['Train', 'Flight', 'Bus', 'Own Vehicle'],
    },
    needPickup: { type: Boolean, required: true },
    arrivalLocation: { type: String, required: true },
    travelDates: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    // Selected destinations
    selectedDestinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
    // Status
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
    adminNotes: { type: String, default: '' },
    whatsappSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TripRequest', tripRequestSchema);
