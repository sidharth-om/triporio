const SeasonalEvent = require('../models/SeasonalEvent');

// @desc  Get all events
// @route GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    if (category && category !== 'All') query.category = category;
    const events = await SeasonalEvent.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single event
// @route GET /api/events/:id
exports.getEvent = async (req, res) => {
  try {
    const event = await SeasonalEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create event (Admin)
// @route POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { name, description, shortDescription, category, location, season, months, highlights } = req.body;
    const image = req.file ? req.file.path : '';
    const event = await SeasonalEvent.create({
      name, description, shortDescription, category, location, season,
      months: months ? JSON.parse(months) : [],
      highlights: highlights ? JSON.parse(highlights) : [],
      image,
    });
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update event (Admin)
// @route PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.path;
    if (updates.months && typeof updates.months === 'string') updates.months = JSON.parse(updates.months);
    if (updates.highlights && typeof updates.highlights === 'string') updates.highlights = JSON.parse(updates.highlights);
    const event = await SeasonalEvent.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete event (Admin)
// @route DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await SeasonalEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
