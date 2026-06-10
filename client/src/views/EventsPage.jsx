import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { eventService } from '../services';
import EventCard from '../components/events/EventCard';
import { CardSkeleton } from '../components/common/LoadingSpinner';

const categories = ['All', 'Cultural', 'Festival', 'Temple', 'Monsoon', 'Food', 'Nature'];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data } = await eventService.getAll({ category, search });
        setEvents(data.events || []);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };
    const delay = setTimeout(fetchEvents, 500); // debounce search
    return () => clearTimeout(delay);
  }, [category, search]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header & Filters */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-4xl md:text-5xl text-white font-bold mb-4">
              Seasonal <span className="gradient-text">Events & Culture</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Dive into the rich heritage of Kerala. From the vibrant Theyyam rituals to spectacular temple festivals, witness traditions that have lived for centuries.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10"
          >
            {/* Search */}
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/20 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Categories */}
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 text-slate-400">
                  <FiFilter /> <span className="text-sm font-medium">Filter:</span>
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      category === cat
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                        : 'bg-black/20 text-slate-300 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
            <p className="text-slate-400">Try searching or selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
