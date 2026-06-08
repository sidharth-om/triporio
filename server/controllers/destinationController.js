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
    const { name, description, shortDescription, category, location, bestSeason, highlights, featured } = req.body;
    const image = req.file ? req.file.path : '';
    const destination = await Destination.create({
      name, description, shortDescription, category, location, bestSeason,
      highlights: highlights ? JSON.parse(highlights) : [],
      image, featured: featured === 'true',
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
