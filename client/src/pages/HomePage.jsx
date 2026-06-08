import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { FiArrowRight, FiMapPin, FiCalendar, FiUsers, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { GiPalmTree, GiWaves, GiMountains, GiTempleGate } from 'react-icons/gi';
import { destinationService, eventService } from '../services';
import DestinationCard from '../components/destinations/DestinationCard';
import { CardSkeleton } from '../components/common/LoadingSpinner';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1580392917481-ce0bd75c5c08?w=1400',
    title: 'Discover North Kerala',
    subtitle: 'Where mountains meet the sea',
    tag: 'Wayanad Hills',
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400',
    title: 'Pristine Golden Beaches',
    subtitle: "Experience Asia's longest drive-in beach",
    tag: 'Muzhappilangad Beach',
  },
  {
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1400',
    title: 'Ancient Cultural Heritage',
    subtitle: 'Witness the magical Theyyam rituals',
    tag: 'Kannur Culture',
  },
  {
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=1400',
    title: 'Historic Coastal Forts',
    subtitle: "Kerala's largest fort by the Arabian Sea",
    tag: 'Bekal Fort',
  },
];

const features = [
  { icon: GiPalmTree, title: 'Lush Forests', desc: 'Explore dense tropical forests teeming with exotic wildlife' },
  { icon: GiWaves, title: 'Pristine Beaches', desc: 'Walk on untouched golden sands by the Arabian Sea' },
  { icon: GiMountains, title: 'Misty Hills', desc: 'Trek through breathtaking hill stations and peaks' },
  { icon: GiTempleGate, title: 'Rich Culture', desc: 'Experience traditional festivals and ancient art forms' },
];

const stats = [
  { number: '50+', label: 'Destinations', icon: FiMapPin },
  { number: '10K+', label: 'Happy Travelers', icon: FiUsers },
  { number: '4.9', label: 'Average Rating', icon: FiStar },
  { number: '365', label: 'Days of Beauty', icon: FiCalendar },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, evtRes] = await Promise.all([
          destinationService.getAll({ featured: true }),
          eventService.getAll(),
        ]);
        setFeatured(destRes.data.destinations?.slice(0, 6) || []);
        setEvents(evtRes.data.events?.slice(0, 3) || []);
      } catch {
        // Use fallback data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen min-h-[600px]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-full"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i} className="relative">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 hero-overlay" />
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="text-center max-w-4xl">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 glass rounded-full text-green-400 text-sm font-semibold mb-6 tracking-wide"
                  >
                    📍 {slide.tag}
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-300 mb-10"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Link to="/destinations" className="btn-primary px-8 py-3.5 text-base">
                      Explore Destinations <FiArrowRight />
                    </Link>
                    <a
                      href="https://wa.me/919746161519"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary px-8 py-3.5 text-base"
                    >
                      <FaWhatsapp className="text-lg" /> Plan via WhatsApp
                    </a>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-3 bg-green-400 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-10 border-y border-white/10 bg-[#060b18]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ number, label, icon: Icon }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Icon className="text-green-400 text-2xl mx-auto mb-2" />
                <div className="text-3xl font-bold gradient-text-green">{number}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY NORTH KERALA ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-green-400 text-sm font-semibold tracking-widest uppercase"
            >
              Why Visit
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl text-white font-bold mt-2"
            >
              North Kerala's <span className="gradient-text">Magic</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-6 text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="text-3xl text-green-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DESTINATIONS ===== */}
      <section className="py-20 px-4 bg-[#060b18]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-green-400 text-sm font-semibold tracking-widest uppercase"
              >
                Explore
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-4xl text-white font-bold mt-1"
              >
                Featured <span className="gradient-text">Destinations</span>
              </motion.h2>
            </div>
            <Link to="/destinations" className="btn-secondary mt-4 sm:mt-0">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
              : featured.map((dest) => (
                <DestinationCard key={dest._id} destination={dest} />
              ))}
          </div>
        </div>
      </section>

      {/* ===== SEASONAL EVENTS PREVIEW ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14">
            <div>
              <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Cultural</span>
              <h2 className="font-display text-4xl text-white font-bold mt-1">
                Seasonal <span className="gradient-text">Events</span>
              </h2>
            </div>
            <Link to="/events" className="btn-secondary mt-4 sm:mt-0">
              View All Events <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image || 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800'}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-amber-500/80 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                      {event.season}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg font-display mb-1">{event.name}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
                    <FiMapPin className="text-amber-400" /> {event.location}
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{event.shortDescription}</p>
                  <Link to="/events" className="inline-flex items-center gap-1 text-amber-400 text-sm font-semibold mt-4 hover:gap-2 transition-all">
                    Learn More <FiArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-900/30 to-teal-900/30 border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl text-white font-bold mb-4"
          >
            Ready to Explore <span className="gradient-text">North Kerala?</span>
          </motion.h2>
          <p className="text-slate-300 text-lg mb-10">
            Plan your dream trip today. Select destinations, answer a few questions, and we'll contact you on WhatsApp with a custom itinerary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary px-10 py-4 text-lg">
              Start Planning <FiArrowRight />
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary px-10 py-4 text-lg"
            >
              <FaWhatsapp className="text-xl" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
