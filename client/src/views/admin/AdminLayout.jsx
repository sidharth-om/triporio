"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiMap, FiCalendar, FiMessageSquare, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { GiPalmTree } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: FiHome, end: true },
  { path: '/admin/destinations', label: 'Destinations', icon: FiMap },
  { path: '/admin/events', label: 'Seasonal Events', icon: FiCalendar },
  { path: '/admin/trips', label: 'Trip Requests', icon: FiMessageSquare },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isActive = (itemPath, isExact) => {
    if (isExact) return pathname === itemPath;
    return pathname.startsWith(itemPath) && itemPath !== '/admin';
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex text-slate-300">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-dark border-r border-white/5 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <GiPalmTree className="text-white text-lg" />
            </div>
            <div>
              <p className="font-display text-white font-bold leading-tight">Triporio Admin</p>
              <p className="text-amber-400 text-[10px] font-semibold tracking-widest uppercase">Explore Kerala</p>
            </div>
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
            <FiX className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.path, item.end)
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon className={isActive(item.path, item.end) ? 'text-green-400' : ''} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-amber-400 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <FiLogOut /> Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
            <FiMenu className="text-xl" />
          </button>
          
          <div className="flex-1 flex justify-end">
             <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
               View Live Site ↗
             </Link>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
