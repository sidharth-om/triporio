import Link from 'next/link';
import { GiPalmTree } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060b18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <GiPalmTree className="text-white text-xl" />
              </div>
              <div>
                <p className="font-display text-white font-bold text-lg leading-tight">Triporio</p>
                <p className="text-green-400 text-xs font-semibold tracking-widest uppercase">Explore Kerala</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Discover the untouched beauty of Kerala with Triporio — where culture meets nature in perfect harmony.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-green-400 hover:bg-green-400/10 transition-all">
                  <Icon />
                </a>
              ))}
              <a href="https://wa.me/919746161519" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-green-400 hover:bg-green-400/10 transition-all">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/destinations', 'Destinations'], ['/events', 'Seasonal Events'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-green-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Destinations */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Places</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Wayanad', 'Bekal Fort', 'Kannur', 'Muzhappilangad Beach', 'Paithalmala', 'Aralam Sanctuary'].map((place) => (
                <li key={place} className="hover:text-green-400 cursor-pointer transition-colors">{place}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <FiMapPin className="text-green-400 mt-0.5 shrink-0" />
                <span>Kannur, Kerala, India - 670001</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FiPhone className="text-green-400 shrink-0" />
                <a href="tel:+919746161519" className="hover:text-green-400 transition-colors">+91 97461 61519</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FiMail className="text-green-400 shrink-0" />
                <a href="mailto:info@triporio.com" className="hover:text-green-400 transition-colors">info@triporio.com</a>
              </li>
              <li>
                <a
                  href="https://wa.me/919746161519"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors"
                >
                  <FaWhatsapp className="text-lg" /> Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2024 Triporio. All rights reserved.</p>
          <p>Made with ❤️ for Kerala Tourism</p>
        </div>
      </div>
    </footer>
  );
}
