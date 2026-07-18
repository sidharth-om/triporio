import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMapPin, FiCalendar, FiUsers, FiArrowRight, FiArrowLeft, FiCheck, FiX, FiCheckCircle, FiPlus } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { MdDirectionsBus, MdTrain, MdFlight } from 'react-icons/md';
import { IoCarSport } from 'react-icons/io5';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services';
import toast from 'react-hot-toast';

const arrivalModes = [
  { value: 'Train', icon: MdTrain, label: 'Train' },
  { value: 'Flight', icon: MdFlight, label: 'Flight' },
  { value: 'Bus', icon: MdDirectionsBus, label: 'Bus' },
  { value: 'Own Vehicle', icon: IoCarSport, label: 'Own Vehicle' },
];

const steps = [
  { title: 'Group Size', subtitle: 'How many travelers?' },
  { title: 'Trip Duration', subtitle: 'How many days?' },
  { title: 'Arrival Mode', subtitle: 'How are you arriving?' },
  { title: 'Pickup & Location', subtitle: 'Do you need a pickup?' },
  { title: 'Travel Dates', subtitle: 'When are you visiting?' },
];

export default function TripCartPage() {
  const { cart, removeFromCart, tripPlan, updateTripPlan, generateWhatsAppMessage, clearCart } = useTrip();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white mb-4">Please log in</h2>
        <p className="text-slate-400 mb-8">You need to be logged in to view your trip plan.</p>
        <Link href="/login" className="btn-primary">Log In to Continue</Link>
      </div>
    );
  }

  const handleSendRequest = () => {
    if (cart.length === 0) {
      toast.error('Please add destinations to your trip first!');
      return;
    }
    setStep(0);
    setIsModalOpen(true);
  };

  const handleConfirmAndSend = async () => {
    const finalTripPlan = {
      ...tripPlan,
      arrivalLocation: tripPlan.arrivalLocation || 'Not specified',
      travelDates: {
        from: tripPlan.travelDates?.from || new Date().toISOString().split('T')[0],
        to: tripPlan.travelDates?.to || new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
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
      setIsModalOpen(false);
      
      // Open WhatsApp in the same tab
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
            <p className="text-slate-400 mb-8">You haven't selected any destinations yet. Explore Kerala with Triporio and add your favorite places.</p>
            <Link href="/destinations" className="btn-primary inline-flex">
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
                        onError={(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Blue%2C_Green_%26_White.jpg'; }}
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
                <Link href="/destinations" className="text-green-400 font-medium hover:text-green-300 flex items-center gap-2">
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
                    Clicking the button below will open a short preferences questionnaire before saving your request and redirecting to WhatsApp.
                  </p>
                </div>

                <button
                  onClick={handleSendRequest}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-[#25D366]/30 animate-pulse-subtle"
                >
                  <FaWhatsapp className="text-xl" /> Send Request via WhatsApp
                </button>
                
                <div className="text-center mt-4">
                  <button
                    onClick={() => { setStep(0); setIsModalOpen(true); }}
                    className="text-sm text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Edit Trip Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questionnaire Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-dark border border-white/10 w-full max-w-lg rounded-3xl p-6 md:p-8 relative shadow-2xl my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <FiX className="text-xl" />
              </button>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Question {step + 1} of {steps.length}</span>
                  <span>{Math.round(((step + 1) / steps.length) * 100)}% complete</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Header */}
              <div className="mb-6">
                <h3 className="font-display text-2xl text-white font-bold">{steps[step].title}</h3>
                <p className="text-slate-400 text-sm">{steps[step].subtitle}</p>
              </div>

              {/* Step Body */}
              <div className="min-h-[180px] flex flex-col justify-center py-2">
                {/* Step 0: Group Size */}
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => updateTripPlan({ numberOfPeople: Math.max(1, tripPlan.numberOfPeople - 1) })}
                        className="w-12 h-12 rounded-xl glass border border-white/20 text-white text-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center"
                      >−</button>
                      <div className="text-center">
                        <span className="text-5xl font-bold gradient-text-green">{tripPlan.numberOfPeople}</span>
                        <p className="text-slate-400 mt-1 text-sm">People</p>
                      </div>
                      <button
                        onClick={() => updateTripPlan({ numberOfPeople: Math.min(50, tripPlan.numberOfPeople + 1) })}
                        className="w-12 h-12 rounded-xl glass border border-white/20 text-white text-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center"
                      >+</button>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {[1, 2, 4, 6, 10, 15, 20].map((n) => (
                        <button
                          key={n}
                          onClick={() => updateTripPlan({ numberOfPeople: n })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            tripPlan.numberOfPeople === n ? 'bg-green-500 text-white' : 'glass text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {n === 1 ? 'Solo' : n === 2 ? 'Couple' : `${n} People`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1: Trip Duration */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => updateTripPlan({ numberOfDays: Math.max(1, tripPlan.numberOfDays - 1) })}
                        className="w-12 h-12 rounded-xl glass border border-white/20 text-white text-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center"
                      >−</button>
                      <div className="text-center">
                        <span className="text-5xl font-bold gradient-text-green">{tripPlan.numberOfDays}</span>
                        <p className="text-slate-400 mt-1 text-sm">Days</p>
                      </div>
                      <button
                        onClick={() => updateTripPlan({ numberOfDays: Math.min(30, tripPlan.numberOfDays + 1) })}
                        className="w-12 h-12 rounded-xl glass border border-white/20 text-white text-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center"
                      >+</button>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {[1, 2, 3, 5, 7, 10, 14].map((n) => (
                        <button
                          key={n}
                          onClick={() => updateTripPlan({ numberOfDays: n })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            tripPlan.numberOfDays === n ? 'bg-green-500 text-white' : 'glass text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {n === 1 ? '1 Day' : `${n} Days`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Arrival Mode */}
                {step === 2 && (
                  <div className="grid grid-cols-2 gap-4">
                    {arrivalModes.map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() => updateTripPlan({ arrivalMode: value })}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          tripPlan.arrivalMode === value
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <Icon className="text-3xl" />
                        <span className="font-semibold text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Pickup & Location */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-slate-300 text-sm font-semibold mb-3">Do you need pickup service?</p>
                      <div className="flex gap-4">
                        {[true, false].map((val) => (
                          <button
                            key={String(val)}
                            onClick={() => updateTripPlan({ needPickup: val })}
                            className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition-all ${
                              tripPlan.needPickup === val
                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                : 'border-white/10 text-slate-400 hover:border-white/20'
                            }`}
                          >
                            {val ? '✅ Yes, I need pickup' : '🚗 No, I have transport'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">Arrival Location</label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                        <input
                          type="text"
                          value={tripPlan.arrivalLocation}
                          onChange={(e) => updateTripPlan({ arrivalLocation: e.target.value })}
                          placeholder="e.g. Kannur Railway Station, Calicut Airport..."
                          className="input-dark pl-10 text-sm"
                          id="modal-arrival-location"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Travel Dates */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">
                        <FiCalendar className="inline mr-2 text-green-400" />From Date
                      </label>
                      <input
                        type="date"
                        value={tripPlan.travelDates.from}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => updateTripPlan({ travelDates: { ...tripPlan.travelDates, from: e.target.value } })}
                        className="input-dark text-sm"
                        id="modal-date-from"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">
                        <FiCalendar className="inline mr-2 text-green-400" />To Date
                      </label>
                      <input
                        type="date"
                        value={tripPlan.travelDates.to}
                        min={tripPlan.travelDates.from || new Date().toISOString().split('T')[0]}
                        onChange={(e) => updateTripPlan({ travelDates: { ...tripPlan.travelDates, to: e.target.value } })}
                        className="input-dark text-sm"
                        id="modal-date-to"
                      />
                    </div>

                    {/* Summary */}
                    <div className="glass rounded-xl p-4 mt-4 text-xs">
                      <p className="text-green-400 font-semibold mb-2 flex items-center gap-1">
                        <FiCheckCircle /> Summary
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
                        <span>👥 Travelers: <strong className="text-white">{tripPlan.numberOfPeople}</strong></span>
                        <span>📅 Duration: <strong className="text-white">{tripPlan.numberOfDays} Days</strong></span>
                        <span>✈️ Arrival: <strong className="text-white">{tripPlan.arrivalMode}</strong></span>
                        <span>🚕 Pickup: <strong className="text-white">{tripPlan.needPickup ? 'Yes' : 'No'}</strong></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex gap-4 mt-8 border-t border-white/10 pt-4">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="btn-secondary flex-1 justify-center py-2.5 text-sm"
                  >
                    <FiArrowLeft /> Back
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="btn-primary flex-1 justify-center py-2.5 text-sm"
                  >
                    Next <FiArrowRight />
                  </button>
                ) : (
                  <button
                    onClick={handleConfirmAndSend}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-[#25D366]/30 text-sm transition-all"
                  >
                    {loading ? 'Processing...' : (
                      <><FaWhatsapp className="text-lg" /> Send via WhatsApp</>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
