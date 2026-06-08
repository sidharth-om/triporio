import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { destinationService } from '../services';
import DestinationCard from '../components/destinations/DestinationCard';
import { CardSkeleton } from '../components/common/LoadingSpinner';

const categories = ['All', 'Beach', 'Hill Station', 'Wildlife', 'Heritage', 'Culture', 'Nature', 'Adventure'];

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const { data } = await destinationService.getAll({ category, search });
        setDestinations(data.destinations || []);
      } catch (error) {
        console.error('Failed to fetch destinations', error);
      } finally {
        setLoading(false);
      }
    };
    const delay = setTimeout(fetchDestinations, 500); // debounce search
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
              Explore <span className="gradient-text">Destinations</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From misty hills to golden beaches, discover the untouched beauty of North Kerala. Add your favorite places to your trip plan.
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
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/20 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
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
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
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
        ) : destinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏜️</div>
            <h3 className="text-xl font-bold text-white mb-2">No destinations found</h3>
            <p className="text-slate-400">Try adjusting your search or category filter.</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="mt-6 text-green-400 hover:text-green-300 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
