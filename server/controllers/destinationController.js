const Destination = require('../models/Destination');

// @desc  Get all destinations
// @route GET /api/destinations
exports.getDestinations = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const destinations = await Destination.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: destinations.length, destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single destination
// @route GET /api/destinations/:id
exports.getDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create destination (Admin)
// @route POST /api/destinations
exports.createDestination = async (req, res) => {
  try {
    const { name, description, shortDescription, category, location, bestSeason, highlights, featured, rating } = req.body;
    
    // Check if name already exists (case-insensitive)
    const existing = await Destination.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A destination with this name already exists' });
    }

    const image = req.file ? req.file.path : '';
    const destination = await Destination.create({
      name, description, shortDescription, category, location, bestSeason,
      highlights: highlights ? JSON.parse(highlights) : [],
      image, featured: featured === 'true',
      rating: parseFloat(rating) || 4.5
    });
    res.status(201).json({ success: true, destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update destination (Admin)
// @route PUT /api/destinations/:id
exports.updateDestination = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Check if name is being changed and already exists (case-insensitive)
    if (updates.name) {
      const existing = await Destination.findOne({ 
        name: { $regex: new RegExp(`^${updates.name.trim()}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A destination with this name already exists' });
      }
    }

    if (req.file) updates.image = req.file.path;
    if (updates.highlights && typeof updates.highlights === 'string') {
      updates.highlights = JSON.parse(updates.highlights);
    }
    const destination = await Destination.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete destination (Admin)
// @route DELETE /api/destinations/:id
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, message: 'Destination removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get public landing page stats
// @route GET /api/destinations/stats
exports.getPublicStats = async (req, res) => {
  try {
    const TripRequest = require('../models/TripRequest');
    const destinations = await Destination.find({ isActive: true });
    const destinationsCount = destinations.length;

    let totalRating = 0;
    destinations.forEach(d => {
      totalRating += (d.rating || 4.5);
    });
    const averageRating = destinationsCount > 0 ? (totalRating / destinationsCount).toFixed(1) : "4.9";

    const confirmedTrips = await TripRequest.find({ status: { $in: ['Confirmed', 'Contacted', 'Pending'] } });
    const travelersFromTrips = confirmedTrips.reduce((sum, t) => sum + (t.numberOfPeople || 0), 0);
    const happyTravelers = travelersFromTrips;

    res.json({
      success: true,
      stats: {
        destinationsCount,
        happyTravelers,
        averageRating,
        daysOfBeauty: 365
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

