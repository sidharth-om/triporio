const Review = require('../models/Review');
const Destination = require('../models/Destination');

// @desc  Add or update review for a destination
// @route POST /api/destinations/:id/reviews
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const destId = req.params.id;
    const userId = req.user._id;
    const userName = req.user.name;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a rating between 1 and 5' });
    }

    if (!comment) {
      return res.status(400).json({ success: false, message: 'Please provide a comment' });
    }

    const destination = await Destination.findById(destId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Check if review already exists
    let review = await Review.findOne({ user: userId, destination: destId });
    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      review = await Review.create({
        user: userId,
        destination: destId,
        userName,
        rating,
        comment
      });
    }

    // Calculate new average rating
    const reviews = await Review.find({ destination: destId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(1)) : rating;

    destination.rating = avgRating;
    await destination.save();

    res.status(201).json({ success: true, message: 'Review saved', review, avgRating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all reviews for a destination
// @route GET /api/destinations/:id/reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ destination: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
