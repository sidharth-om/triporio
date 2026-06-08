const express = require('express');
const router = express.Router();
const {
  createTripRequest, getMyTripRequests, getAllTripRequests, updateTripStatus,
} = require('../controllers/tripController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createTripRequest);
router.get('/my', protect, getMyTripRequests);
router.get('/', protect, admin, getAllTripRequests);
router.put('/:id/status', protect, admin, updateTripStatus);

module.exports = router;
