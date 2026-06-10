const express = require('express');
const router = express.Router();
const {
  getDestinations, getDestination, createDestination, updateDestination, deleteDestination, getPublicStats
} = require('../controllers/destinationController');
const { addReview, getReviews } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getDestinations);
router.get('/stats', getPublicStats);
router.get('/:id', getDestination);
router.post('/', protect, admin, upload.single('image'), createDestination);
router.put('/:id', protect, admin, upload.single('image'), updateDestination);
router.delete('/:id', protect, admin, deleteDestination);

// Reviews routes
router.post('/:id/reviews', protect, addReview);
router.get('/:id/reviews', getReviews);

module.exports = router;
