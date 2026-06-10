import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMap, FiHeart, FiAward } from 'react-icons/fi';
import { destinationService } from '../services';

export default function AboutPage() {
  const [destinationsCount, setDestinationsCount] = useState('50+');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await destinationService.getStats();
        if (data?.success) {
          setDestinationsCount(`${data.stats.destinationsCount}+`);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  const statsList = [
    { icon: FiMap, title: `${destinationsCount} Destinations`, desc: "Curated hidden gems across Kerala." },
    { icon: FiUsers, title: "Local Guides", desc: "Authentic experiences led by locals." },
    { icon: FiHeart, title: "Eco-Friendly", desc: "Sustainable tourism practices." },
    { icon: FiAward, title: "Premium Service", desc: "Tailor-made itineraries just for you." }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-400 text-sm font-semibold tracking-widest uppercase"
          >
            Our Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl text-white font-bold"
          >
            Discover the Soul of Kerala with <span className="gradient-text">Triporio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg leading-relaxed"
          >
            Triporio is a passionate team of local experts dedicated to uncovering the hidden gems, vibrant culture, and untouched nature of Kerala's northern districts. We believe in authentic travel experiences that connect you with the soul of our land.
          </motion.p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl overflow-hidden h-80"
          >
            <img 
              src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000" 
              alt="Kerala Backwaters" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl overflow-hidden h-80"
          >
            <img 
              src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1000" 
              alt="Theyyam performance" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>

        {/* Stats / Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-3xl text-center space-y-4 hover:border-amber-500/30 transition-colors"
            >
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto text-amber-400 text-2xl">
                <item.icon />
              </div>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
