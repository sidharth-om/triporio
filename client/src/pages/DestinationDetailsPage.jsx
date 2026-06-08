import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiStar, FiArrowLeft, FiCheck, FiPlus } from 'react-icons/fi';
import { destinationService } from '../services';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DestinationDetailsPage() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, isInCart } = useTrip();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const { data } = await destinationService.getById(id);
        setDestination(data.destination);
      } catch (error) {
        console.error('Error fetching destination details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!destination) return <div className="min-h-screen pt-32 text-center text-white text-2xl">Destination not found</div>;

  const inCart = isInCart(destination._id);

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580392917481-ce0bd75c5c08?w=1400'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/60 to-transparent" />
        
        <div className="absolute top-6 left-4 md:left-8">
          <Link to="/destinations" className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 text-white transition-colors">
            <FiArrowLeft /> Back to Destinations
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                  {destination.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-sm font-semibold border border-amber-400/20">
                  <FiStar className="fill-current" /> {destination.rating}
                </div>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 leading-tight">
                {destination.name}
              </h1>

              <div className="flex items-center gap-6 text-slate-300 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-green-400 text-lg" />
                  {destination.location}
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-amber-400 text-lg" />
                  Best Time: {destination.bestSeason}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 md:p-8 rounded-3xl"
            >
              <h2 className="text-2xl font-bold text-white mb-4 font-display">About this place</h2>
              <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                {destination.description}
              </p>
            </motion.div>

            {destination.highlights && destination.highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 md:p-8 rounded-3xl"
              >
                <h2 className="text-2xl font-bold text-white mb-6 font-display">Key Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <FiCheck className="text-green-400 text-sm" />
                      </div>
                      <span className="text-slate-300">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-dark p-6 rounded-3xl sticky top-28 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-2 font-display">Add to your trip</h3>
              <p className="text-slate-400 text-sm mb-6">
                Include {destination.name} in your personalized North Kerala itinerary.
              </p>

              <button
                onClick={() => inCart ? removeFromCart(destination._id) : addToCart(destination)}
                className={`w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  inCart 
                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500 hover:bg-green-500/30' 
                    : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30'
                }`}
              >
                {inCart ? (
                  <><FiCheck className="text-xl" /> Added to Trip</>
                ) : (
                  <><FiPlus className="text-xl" /> Add to Trip</>
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-center text-xs text-slate-500 mt-4">
                  <Link to="/login" className="text-green-400 hover:underline">Log in</Link> to save your trip plans
                </p>
              )}

              <hr className="border-white/10 my-6" />

              <div className="space-y-4">
                <h4 className="text-white font-semibold mb-2">Need help?</h4>
                <a
                  href="https://wa.me/919746161519"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
