const express = require('express');
const router = express.Router();
const {
  getDestinations, getDestination, createDestination, updateDestination, deleteDestination,
} = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getDestinations);
router.get('/:id', getDestination);
router.post('/', protect, admin, upload.single('image'), createDestination);
router.put('/:id', protect, admin, upload.single('image'), updateDestination);
router.delete('/:id', protect, admin, deleteDestination);

module.exports = router;
