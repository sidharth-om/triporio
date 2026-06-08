const TripRequest = require('../models/TripRequest');

// @desc  Create trip request
// @route POST /api/trips
exports.createTripRequest = async (req, res) => {
  try {
    const {
      numberOfPeople, numberOfDays, arrivalMode, needPickup,
      arrivalLocation, travelDates, selectedDestinations,
    } = req.body;

    const tripRequest = await TripRequest.create({
      user: req.user._id,
      numberOfPeople, numberOfDays, arrivalMode, needPickup,
      arrivalLocation, travelDates, selectedDestinations,
    });

    await tripRequest.populate('user', 'name email phone');
    await tripRequest.populate('selectedDestinations', 'name location');

    res.status(201).json({ success: true, tripRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get my trip requests
// @route GET /api/trips/my
exports.getMyTripRequests = async (req, res) => {
  try {
    const trips = await TripRequest.find({ user: req.user._id })
      .populate('selectedDestinations', 'name location image category')
      .sort({ createdAt: -1 });
    res.json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all trip requests (Admin)
// @route GET /api/trips
exports.getAllTripRequests = async (req, res) => {
  try {
    const trips = await TripRequest.find()
      .populate('user', 'name email phone')
      .populate('selectedDestinations', 'name location image category')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: trips.length, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update trip request status (Admin)
// @route PUT /api/trips/:id/status
exports.updateTripStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const trip = await TripRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    ).populate('user', 'name email phone').populate('selectedDestinations', 'name location');

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
