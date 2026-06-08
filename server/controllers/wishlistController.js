const User = require('../models/User');

// @desc  Toggle wishlist destination
// @route POST /api/wishlist/toggle/:destId
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const destId = req.params.destId;
    const idx = user.wishlist.indexOf(destId);
    if (idx === -1) {
      user.wishlist.push(destId);
    } else {
      user.wishlist.splice(idx, 1);
    }
    await user.save();
    await user.populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get user wishlist
// @route GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
