import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMap, FiCalendar, FiMessageSquare, FiRefreshCw } from 'react-icons/fi';
import { adminService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getStats();
      setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSeedData = () => {
    toast((t) => (
      <span className="flex flex-col gap-3 p-1">
        <span className="text-sm font-medium text-slate-200">
          This will delete all current destinations and events and replace them with default dummy data. Proceed?
        </span>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              setSeeding(true);
              try {
                const { data } = await adminService.seedData();
                toast.success(data.message);
                fetchStats();
              } catch (error) {
                toast.error('Failed to seed data');
                console.error(error);
              } finally {
                setSeeding(false);
              }
            }}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Yes, Seed Data
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 6000 });
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Destinations', value: stats?.totalDestinations || 0, icon: FiMap, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'Seasonal Events', value: stats?.totalEvents || 0, icon: FiCalendar, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { title: 'Pending Trips', value: stats?.pendingTrips || 0, icon: FiMessageSquare, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome to the admin control panel.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSeedData} 
            disabled={seeding}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <FiRefreshCw className={seeding ? "animate-spin" : ""} />
            {seeding ? 'Seeding...' : 'Seed Demo Data'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl border border-white/5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`text-xl ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/admin/destinations" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
              <div className="font-medium text-white mb-1">Add New Destination</div>
              <div className="text-sm text-slate-400">Create a new tourist spot with images and details.</div>
            </a>
            <a href="/admin/trips" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
              <div className="font-medium text-white mb-1">Review Trip Requests</div>
              <div className="text-sm text-slate-400">Check incoming queries and contact users.</div>
            </a>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5">
          <h2 className="text-lg font-bold text-white mb-4">System Info</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Status</span>
              <span className="text-green-400 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
              </span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Environment</span>
              <span className="text-white">Production</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Version</span>
              <span className="text-white">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
