const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, seedData } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getAllUsers);
router.post('/seed', protect, admin, seedData);

module.exports = router;
