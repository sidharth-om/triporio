import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiPlusCircle, FiCheckCircle } from 'react-icons/fi';
import { useTrip } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function EventCard({ event }) {
  const { addToCart, removeFromCart, isInCart } = useTrip();
  const { isAuthenticated } = useAuth();
  const inCart = isInCart(event._id);

  const handleCartToggle = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to plan your trip');
      return;
    }
    if (inCart) {
      removeFromCart(event._id);
    } else {
      addToCart(event);
    }
  };

  const imageUrl = event.image || 'https://upload.wikimedia.org/wikipedia/commons/3/38/Kathivanoor_Veeran_Chemmarathi_Thara-Eripuram.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl overflow-hidden card-glow group flex flex-col h-full"
    >
      <div className="flex flex-col flex-1">
        <div className="relative h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Bakel_Fort_Beach_Kasaragod7.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#0a0f1e]/85 text-amber-400 border border-amber-500/30 backdrop-blur-md shadow-lg">
              {event.category}
            </span>
          </div>

          {/* Season */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5">
            <FiCalendar className="text-amber-400 text-xs" />
            <span className="text-white text-xs font-semibold">{event.season}</span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-white font-bold text-lg font-display mb-1">{event.name}</h3>

          <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-3">
            <FiMapPin className="text-green-400 shrink-0" />
            <span>{event.location}</span>
          </div>

          <p className="text-slate-400 text-sm line-clamp-3 mb-4">{event.shortDescription || event.description}</p>

          {event.months && event.months.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto mb-2">
              {event.months.map((m) => (
                <span key={m} className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] rounded border border-white/5 font-medium">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 flex gap-2">
        <button
          onClick={handleCartToggle}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            inCart
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-amber-500 hover:bg-amber-600 text-white transition-colors'
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
