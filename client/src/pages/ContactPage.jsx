import { motion } from 'framer-motion';
import { FiMail, FiPhoneCall, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
  const whatsappNumber = "919746161519";
  const displayPhone = "+91 97461 61519";
  
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Hi! I would like to know more about the tour packages.`, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-400 text-sm font-semibold tracking-widest uppercase"
          >
            Get in touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl text-white font-bold"
          >
            Contact <span className="gradient-text">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg"
          >
            Have questions about your trip? Want a customized package? We're here to help you plan the perfect North Kerala experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-3xl flex items-center gap-6 group hover:border-green-500/30 transition-all cursor-pointer"
              onClick={handleWhatsApp}
            >
              <div className="w-16 h-16 bg-[#25D366]/20 rounded-2xl flex items-center justify-center text-[#25D366] text-3xl group-hover:scale-110 transition-transform">
                <FaWhatsapp />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-1">Chat on WhatsApp</h3>
                <p className="text-slate-400">{displayPhone}</p>
                <span className="text-[#25D366] text-sm font-medium mt-2 inline-block">Click to message us "?</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-8 rounded-3xl flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 text-3xl">
                <FiPhoneCall />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-1">Call Us Directly</h3>
                <p className="text-slate-400">{displayPhone}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-8 rounded-3xl flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 text-3xl">
                <FiMail />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-1">Email Us</h3>
                <p className="text-slate-400">info@explorenorthkerala.com</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form / Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-dark p-8 rounded-3xl border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-6 font-display">Send a Quick Message</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleWhatsApp(); }}>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <input type="text" className="input-field" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea className="input-field min-h-[150px] resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                <FaWhatsapp className="text-xl" /> Send via WhatsApp
              </button>
            </form>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
