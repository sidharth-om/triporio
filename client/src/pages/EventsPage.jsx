import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiCheck } from 'react-icons/fi';
import { eventService } from '../services';
import { useTrip } from '../context/TripContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const categories = ['All', 'Cultural', 'Festival', 'Temple', 'Monsoon', 'Food', 'Nature'];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const { addToCart, removeFromCart, isInCart } = useTrip();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data } = await eventService.getAll({ category });
        setEvents(data.events || []);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [category]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-400 text-sm font-semibold tracking-widest uppercase"
          >
            Experience
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-bold mt-2 mb-6"
          >
            Seasonal <span className="text-amber-400">Events & Culture</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Dive into the rich heritage of North Kerala. From the vibrant Theyyam rituals to spectacular temple festivals, witness traditions that have lived for centuries.
          </motion.p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events List */}
        {loading ? (
          <LoadingSpinner text="Loading cultural events..." />
        ) : events.length > 0 ? (
          <div className="space-y-12 md:space-y-24">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="relative rounded-3xl overflow-hidden group aspect-[4/3] md:aspect-[5/4]">
                    <img
                      src={event.image || 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1000'}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] to-transparent opacity-60" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-amber-500/90 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-wider uppercase">
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl text-white font-bold mb-4">{event.name}</h2>
                    <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm">
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        <FiCalendar className="text-amber-400" />
                        <span className="font-medium text-white">{event.season}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-green-400" />
                        {event.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-lg">
                    {event.description}
                  </p>

                  {event.months && event.months.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-400 mb-2 font-medium">Best Months to Visit:</p>
                      <div className="flex flex-wrap gap-2">
                        {event.months.map((month) => (
                          <span key={month} className="px-3 py-1 bg-white/5 text-slate-300 text-xs rounded-lg border border-white/10">
                            {month}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.highlights && event.highlights.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {event.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <FiCheck className="text-amber-400 mt-1 shrink-0" />
                            <span className="text-slate-300 text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6">
                    {isInCart(event._id) ? (
                      <button
                        onClick={() => removeFromCart(event._id)}
                        className="btn-glass text-red-400 border-red-400/30 hover:bg-red-400/10 w-full sm:w-auto px-8"
                      >
                        Remove from Trip
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(event)}
                        className="btn-primary w-full sm:w-auto px-8"
                      >
                        Add to Trip
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
            <p className="text-slate-400">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
