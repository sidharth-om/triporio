import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiMapPin, FiCalendar, FiHeart, FiPlusCircle, FiCheckCircle, FiStar } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';
import { wishlistService } from '../../services';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DestinationCard({ destination, userWishlist = [], onWishlistUpdate }) {
  const { isAuthenticated } = useAuth();
  const { addToCart, removeFromCart, isInCart } = useTrip();
  const [wishlisted, setWishlisted] = useState(
    userWishlist.some((id) => id === destination._id || id?._id === destination._id)
  );
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const inCart = isInCart(destination._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to save destinations');
      return;
    }
    setWishlistLoading(true);
    try {
      await wishlistService.toggle(destination._id);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️');
      onWishlistUpdate?.();
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleCartToggle = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to plan your trip');
      return;
    }
    if (inCart) {
      removeFromCart(destination._id);
    } else {
      addToCart(destination);
    }
  };

  const imageUrl = destination.image?.startsWith('http')
    ? destination.image
    : destination.image
    ? `${destination.image}`
    : 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Blue%2C_Green_%26_White.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl overflow-hidden card-glow group flex flex-col h-full"
    >
      <Link href={`/destinations/${destination._id}`} className="flex flex-col flex-1">
        <div className="relative h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Muzhappilangad_Drive-in_Beach_2.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#0a0f1e]/85 text-green-400 border border-green-500/30 backdrop-blur-md shadow-lg">
              {destination.category}
            </span>
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-sm border transition-all flex items-center justify-center ${
              wishlisted ? 'bg-red-500 border-red-400 text-white' : 'bg-black/30 border-white/20 text-white hover:bg-red-500/20'
            }`}
          >
            <FiHeart className={wishlisted ? 'fill-current' : ''} />
          </button>

          {/* Rating */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
            <FiStar className="text-amber-400 text-xs fill-current" />
            <span className="text-white text-xs font-semibold">{destination.rating}</span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-white font-bold text-lg font-display mb-1">{destination.name}</h3>

          <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
            <FiMapPin className="text-green-400 shrink-0" />
            <span>{destination.location}</span>
          </div>

          <p className="text-slate-400 text-sm line-clamp-2 mb-4">{destination.shortDescription}</p>

          <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-auto mb-5">
            <FiCalendar className="shrink-0" />
            <span>Best: {destination.bestSeason}</span>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 flex gap-2">
        <button
          onClick={handleCartToggle}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            inCart
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'btn-primary justify-center'
          }`}
        >
          {inCart ? (
            <><FiCheckCircle /> Added to Trip</>
          ) : (
            <><FiPlusCircle /> Add to Trip</>
          )}
        </button>
      </div>
    </motion.div>
  );
}
