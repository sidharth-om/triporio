import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiHeart, FiClock, FiSettings, FiMapPin, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { tripService, wishlistService } from '../services';
import DestinationCard from '../components/destinations/DestinationCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const tabs = [
  { id: 'requests', label: 'My Requests', icon: FiClock },
  { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
  { id: 'profile', label: 'Profile Settings', icon: FiSettings },
];

const statusColors = {
  Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
  Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function DashboardPage() {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [trips, setTrips] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Profile edit state
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [savingStatus, setSavingStatus] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [tripsRes, wishlistRes] = await Promise.all([
          tripService.getMy(),
          wishlistService.get()
        ]);
        setTrips(tripsRes.data.trips || []);
        setWishlist(wishlistRes.data.wishlist || []);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingStatus('saving');
    try {
      const { authService } = await import('../services');
      const { data } = await authService.updateProfile({ name: editName, phone: editPhone });
      updateUser(data.user);
      setSavingStatus('success');
      setTimeout(() => setSavingStatus(''), 3000);
    } catch (error) {
      console.error(error);
      setSavingStatus('error');
    }
  };

  const handleWishlistUpdate = async () => {
    // Re-fetch wishlist if a card removes itself
    const res = await wishlistService.get();
    setWishlist(res.data.wishlist || []);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Profile Summary */}
        <div className="glass rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center border-4 border-[#0a0f1e] shadow-xl shrink-0">
            <span className="text-4xl text-white font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="font-display text-3xl text-white font-bold mb-2">{user?.name}</h1>
            <p className="text-slate-400 flex items-center justify-center md:justify-start gap-4 text-sm">
              <span>{user?.email}</span>
              <span className="hidden md:inline">•</span>
              <span>{user?.phone}</span>
            </p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors text-sm font-medium"
          >
            <FiLogOut /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                    : 'glass text-slate-300 hover:bg-white/10'
                }`}
              >
                <tab.icon className="text-lg" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* TRIP REQUESTS */}
            {activeTab === 'requests' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-white mb-6 font-display">My Trip Requests</h2>
                {trips.length === 0 ? (
                  <div className="glass rounded-2xl p-10 text-center border border-white/5">
                    <p className="text-slate-400 mb-4">You haven't made any trip requests yet.</p>
                    <a href="/trip-plan" className="btn-primary inline-flex">Start Planning</a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trips.map((trip) => (
                      <div key={trip._id} className="glass rounded-2xl p-6 border border-white/5">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b border-white/10">
                          <div>
                            <span className="text-xs text-slate-500">Requested on {new Date(trip.createdAt).toLocaleDateString()}</span>
                            <div className="flex items-center gap-4 mt-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[trip.status]}`}>
                                {trip.status}
                              </span>
                              <span className="text-slate-300 text-sm">{trip.numberOfDays} Days • {trip.numberOfPeople} People</span>
                            </div>
                          </div>
                          {trip.adminNotes && (
                            <div className="bg-white/5 px-4 py-2 rounded-lg text-sm max-w-xs">
                              <span className="text-green-400 font-semibold block mb-1">Message from Admin:</span>
                              <span className="text-slate-300 italic">"{trip.adminNotes}"</span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm text-slate-400 mb-3 font-medium">Selected Destinations:</p>
                          <div className="flex flex-wrap gap-2">
                            {trip.selectedDestinations.map(dest => (
                              <span key={dest._id} className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg text-xs text-white">
                                <FiMapPin className="text-green-400" /> {dest.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* WISHLIST */}
            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-white mb-6 font-display">My Wishlist</h2>
                {wishlist.length === 0 ? (
                  <div className="glass rounded-2xl p-10 text-center border border-white/5">
                    <p className="text-slate-400 mb-4">Your wishlist is empty.</p>
                    <a href="/destinations" className="btn-primary inline-flex">Explore Destinations</a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlist.map(dest => (
                      <DestinationCard 
                        key={dest._id} 
                        destination={dest} 
                        userWishlist={wishlist} 
                        onWishlistUpdate={handleWishlistUpdate}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-white mb-6 font-display">Profile Settings</h2>
                <div className="glass rounded-2xl p-6 md:p-8 border border-white/5 max-w-xl">
                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                      <input type="email" value={user?.email} disabled className="input-dark opacity-50 cursor-not-allowed" />
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-dark" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
                      <input 
                        type="tel" 
                        value={editPhone} 
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="input-dark" 
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={savingStatus === 'saving'}
                      className="btn-primary w-full justify-center"
                    >
                      {savingStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                    </button>
                    
                    {savingStatus === 'success' && <p className="text-green-400 text-sm text-center">Profile updated successfully!</p>}
                    {savingStatus === 'error' && <p className="text-red-400 text-sm text-center">Failed to update profile.</p>}
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
