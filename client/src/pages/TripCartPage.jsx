import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMapPin, FiCalendar, FiUsers, FiArrowRight, FiCheckCircle, FiPlus } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services';
import toast from 'react-hot-toast';

export default function TripCartPage() {
  const { cart, removeFromCart, tripPlan, generateWhatsAppMessage, clearCart } = useTrip();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white mb-4">Please log in</h2>
        <p className="text-slate-400 mb-8">You need to be logged in to view your trip plan.</p>
        <Link to="/login" className="btn-primary">Log In to Continue</Link>
      </div>
    );
  }

  const handleSendRequest = async () => {
    if (cart.length === 0) {
      toast.error('Please add destinations to your trip first!');
      return;
    }

    const finalTripPlan = {
      ...tripPlan,
      arrivalLocation: tripPlan.arrivalLocation || 'Not specified',
      travelDates: {
        from: tripPlan.travelDates?.from || new Date().toISOString(),
        to: tripPlan.travelDates?.to || new Date(Date.now() + 3*24*60*60*1000).toISOString(),
      }
    };
    
    setLoading(true);
    try {
      // 1. Save trip request to database
      await tripService.create({
        ...finalTripPlan,
        selectedDestinations: cart.map(d => d._id)
      });
      
      toast.success('Trip request saved to your dashboard!');
      
      // 2. Generate WhatsApp link
      const message = generateWhatsAppMessage(user?.name || 'User', user?.phone || 'Not provided');
      const adminPhone = "919746161519"; 
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${message}`;
      
      // Clear cart after sending
      clearCart();
      
      // Open WhatsApp in the same tab to avoid popup blockers
      window.location.href = whatsappUrl;
    } catch (error) {
      toast.error('Failed to send trip request. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl text-white font-bold mb-4">Your <span className="gradient-text">Trip Plan</span></h1>
          <p className="text-slate-400">Review your selected destinations and send a request for pricing.</p>
        </div>

        {cart.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🧳</div>
            <h2 className="text-2xl font-bold text-white mb-4">Your trip is empty</h2>
            <p className="text-slate-400 mb-8">You haven't selected any destinations yet. Explore North Kerala and add your favorite places.</p>
            <Link to="/destinations" className="btn-primary inline-flex">
              Explore Destinations <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Destinations List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FiMapPin className="text-green-400" /> Selected Destinations ({cart.length})
              </h2>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {cart.map((dest) => (
                    <motion.div
                      key={dest._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, x: -20 }}
                      className="glass p-4 rounded-2xl flex items-center gap-4 group"
                    >
                      <img 
                        src={dest.image} 
                        alt={dest.name} 
                        className="w-24 h-24 rounded-xl object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580392917481-ce0bd75c5c08?w=400'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">{dest.name}</h3>
                        <p className="text-sm text-slate-400 truncate">{dest.location}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-white/5 text-xs text-slate-300 rounded border border-white/10">
                          {dest.category}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(dest._id)}
                        className="p-3 text-red-400 bg-red-400/10 rounded-xl hover:bg-red-400 hover:text-white transition-colors"
                        title="Remove"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8">
                <Link to="/destinations" className="text-green-400 font-medium hover:text-green-300 flex items-center gap-2">
                  <FiPlus /> Add more destinations
                </Link>
              </div>
            </div>

            {/* Right Col: Trip Summary & Actions */}
            <div className="lg:col-span-1">
              <div className="glass-dark p-6 rounded-3xl sticky top-28 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6 font-display border-b border-white/10 pb-4">Trip Details</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 text-slate-300">
                      <FiUsers className="text-green-400" />
                      <span>Travelers</span>
                    </div>
                    <span className="font-semibold text-white">{tripPlan.numberOfPeople}</span>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 text-slate-300">
                      <FiCalendar className="text-green-400" />
                      <span>Duration</span>
                    </div>
                    <span className="font-semibold text-white">{tripPlan.numberOfDays} Days</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 text-slate-300">
                      <span className="text-green-400">✈️</span>
                      <span>Arrival Mode</span>
                    </div>
                    <span className="font-semibold text-white">{tripPlan.arrivalMode}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 text-slate-300">
                      <span className="text-green-400">🚕</span>
                      <span>Pickup Needed</span>
                    </div>
                    <span className="font-semibold text-white">{tripPlan.needPickup ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                  <h4 className="text-amber-400 font-semibold text-sm flex items-center gap-2 mb-2">
                    <FiCheckCircle /> Next Steps
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Clicking the button below will save your request and open WhatsApp. Our team will review your requirements and send you a personalized package with pricing.
                  </p>
                </div>

                <button
                  onClick={handleSendRequest}
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-[#25D366]/30"
                >
                  {loading ? 'Processing...' : (
                    <><FaWhatsapp className="text-xl" /> Send Request via WhatsApp</>
                  )}
                </button>
                
                <div className="text-center mt-4">
                  <Link to="/trip-plan" className="text-sm text-slate-400 hover:text-white">
                    Edit Trip Preferences
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
