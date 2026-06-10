import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiCalendar, FiTruck, FiMapPin, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { MdDirectionsBus, MdTrain, MdFlight } from 'react-icons/md';
import { IoCarSport } from 'react-icons/io5';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

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

export default function TripPlanPage() {
  const [step, setStep] = useState(0);
  const { tripPlan, updateTripPlan } = useTrip();
  const { user } = useAuth();
  const router = useRouter();

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = () => {
    router.push('/destinations');
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl text-white font-bold"
          >
            Plan Your <span className="gradient-text">Kerala Trip</span>
          </motion.h1>
          <p className="text-slate-400 mt-2">Hi {user?.name?.split(' ')[0]}! Let's customize your perfect itinerary.</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-3">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-1 ${i > step ? 'opacity-40' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i < step ? 'bg-green-500 border-green-500 text-white' :
                  i === step ? 'border-green-400 text-green-400' :
                  'border-white/20 text-white/30'
                }`}>
                  {i < step ? <FiCheck /> : i + 1}
                </div>
                <span className="hidden md:block text-xs text-slate-400 text-center" style={{ maxWidth: 70 }}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-8 mb-6"
          >
            <h2 className="font-display text-2xl text-white font-bold mb-1">{steps[step].title}</h2>
            <p className="text-slate-400 mb-8">{steps[step].subtitle}</p>

            {/* Step 0: People */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => updateTripPlan({ numberOfPeople: Math.max(1, tripPlan.numberOfPeople - 1) })}
                    className="w-12 h-12 rounded-xl glass border border-white/20 text-white text-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center"
                  >−</button>
                  <div className="text-center">
                    <span className="text-6xl font-bold gradient-text-green">{tripPlan.numberOfPeople}</span>
                    <p className="text-slate-400 mt-1">People</p>
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
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        tripPlan.numberOfPeople === n ? 'bg-green-500 text-white' : 'glass text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {n === 1 ? 'Solo' : n === 2 ? 'Couple' : `${n} People`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Days */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => updateTripPlan({ numberOfDays: Math.max(1, tripPlan.numberOfDays - 1) })}
                    className="w-12 h-12 rounded-xl glass border border-white/20 text-white text-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center"
                  >−</button>
                  <div className="text-center">
                    <span className="text-6xl font-bold gradient-text-green">{tripPlan.numberOfDays}</span>
                    <p className="text-slate-400 mt-1">Days</p>
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
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        tripPlan.numberOfDays === n ? 'bg-green-500 text-white' : 'glass text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {n === 1 ? '1 Day' : `${n} Days`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Arrival mode */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {arrivalModes.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => updateTripPlan({ arrivalMode: value })}
                    className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                      tripPlan.arrivalMode === value
                        ? 'border-green-500 bg-green-500/10 text-green-400'
                        : 'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="text-4xl" />
                    <span className="font-semibold text-sm">{label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Pickup & Location */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-slate-300 font-medium mb-3">Do you need pickup service?</p>
                  <div className="flex gap-4">
                    {[true, false].map((val) => (
                      <button
                        key={String(val)}
                        onClick={() => updateTripPlan({ needPickup: val })}
                        className={`flex-1 py-4 rounded-xl border-2 font-semibold transition-all ${
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
                  <label className="block text-slate-300 font-medium mb-2">Arrival Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                    <input
                      type="text"
                      value={tripPlan.arrivalLocation}
                      onChange={(e) => updateTripPlan({ arrivalLocation: e.target.value })}
                      placeholder="e.g. Kannur Railway Station, Calicut Airport..."
                      className="input-dark pl-10"
                      id="arrival-location"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Travel dates */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    <FiCalendar className="inline mr-2 text-green-400" />From Date
                  </label>
                  <input
                    type="date"
                    value={tripPlan.travelDates.from}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateTripPlan({ travelDates: { ...tripPlan.travelDates, from: e.target.value } })}
                    className="input-dark"
                    id="date-from"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    <FiCalendar className="inline mr-2 text-green-400" />To Date
                  </label>
                  <input
                    type="date"
                    value={tripPlan.travelDates.to}
                    min={tripPlan.travelDates.from || new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateTripPlan({ travelDates: { ...tripPlan.travelDates, to: e.target.value } })}
                    className="input-dark"
                    id="date-to"
                  />
                </div>

                {/* Summary */}
                <div className="glass rounded-xl p-4 mt-4">
                  <p className="text-green-400 font-semibold text-sm mb-3">📋 Trip Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                    <span>👥 People:</span><span className="text-white font-medium">{tripPlan.numberOfPeople}</span>
                    <span>📅 Days:</span><span className="text-white font-medium">{tripPlan.numberOfDays}</span>
                    <span>✈️ Arrival:</span><span className="text-white font-medium">{tripPlan.arrivalMode}</span>
                    <span>🚕 Pickup:</span><span className="text-white font-medium">{tripPlan.needPickup ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          {step > 0 && (
            <button onClick={prev} className="btn-secondary flex-1 justify-center">
              <FiArrowLeft /> Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={next} className="btn-primary flex-1 justify-center">
              Next <FiArrowRight />
            </button>
          ) : (
            <button onClick={handleFinish} className="btn-primary flex-1 justify-center text-base py-3.5">
              🗺️ Select Destinations <FiArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
