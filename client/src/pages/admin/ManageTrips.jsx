import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiMessageCircle, FiX, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { tripService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const statusColors = {
  Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
  Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function ManageTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const { data } = await tripService.getAll();
      setTrips(data.trips);
    } catch (error) {
      toast.error('Failed to fetch trip requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleUpdateStatus = async (status) => {
    if (!selectedTrip) return;
    setUpdating(true);
    try {
      await tripService.updateStatus(selectedTrip._id, { status, adminNotes });
      toast.success(`Trip marked as ${status}`);
      setSelectedTrip(null);
      fetchTrips();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Trip Requests</h1>
          <p className="text-slate-400 text-sm">Review and manage user trip plans.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Trips */}
        <div className="lg:col-span-2 space-y-4">
          {trips.length === 0 ? (
            <div className="glass p-8 text-center rounded-2xl">
              <p className="text-slate-400">No trip requests found.</p>
            </div>
          ) : (
            trips.map(trip => (
              <div 
                key={trip._id} 
                onClick={() => { setSelectedTrip(trip); setAdminNotes(trip.adminNotes || ''); }}
                className={`glass p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedTrip?._id === trip._id 
                    ? 'border-green-500/50 bg-white/10' 
                    : 'border-white/5 hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{trip.user?.name || 'Unknown User'}</h3>
                    <p className="text-xs text-slate-400">{trip.user?.email} • {trip.user?.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[trip.status]}`}>
                    {trip.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-300 mt-4">
                  <div><span className="text-slate-500">Days:</span> {trip.numberOfDays}</div>
                  <div><span className="text-slate-500">People:</span> {trip.numberOfPeople}</div>
                  <div><span className="text-slate-500">Arrival:</span> {trip.arrivalMode}</div>
                  <div><span className="text-slate-500">Pickup:</span> {trip.needPickup ? 'Yes' : 'No'}</div>
                </div>

                <div className="mt-3 text-sm">
                  <span className="text-slate-500 block mb-1">Destinations ({trip.selectedDestinations?.length || 0}):</span>
                  <div className="truncate text-slate-300">
                    {trip.selectedDestinations?.map(d => d.name).join(', ') || 'None'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedTrip ? (
            <div className="glass-dark p-6 rounded-3xl sticky top-4 border border-white/10">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white font-display">Request Details</h2>
                <button onClick={() => setSelectedTrip(null)} className="text-slate-400 hover:text-white">
                  <FiX />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">User Details</h4>
                  <p className="text-white font-medium">{selectedTrip.user?.name}</p>
                  <p className="text-sm text-slate-400">{selectedTrip.user?.email}</p>
                  <p className="text-sm text-slate-400">{selectedTrip.user?.phone}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trip Plan</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li><strong className="text-slate-400">People:</strong> {selectedTrip.numberOfPeople}</li>
                    <li><strong className="text-slate-400">Days:</strong> {selectedTrip.numberOfDays}</li>
                    <li><strong className="text-slate-400">Arrival:</strong> {selectedTrip.arrivalMode} ({selectedTrip.arrivalLocation})</li>
                    <li><strong className="text-slate-400">Pickup:</strong> {selectedTrip.needPickup ? 'Yes' : 'No'}</li>
                    <li>
                      <strong className="text-slate-400">Dates:</strong>{' '}
                      {new Date(selectedTrip.travelDates?.from).toLocaleDateString()} to {new Date(selectedTrip.travelDates?.to).toLocaleDateString()}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Destinations</h4>
                  <div className="space-y-2">
                    {selectedTrip.selectedDestinations?.map(dest => (
                      <div key={dest._id} className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
                        <FiMapPin className="text-green-400 shrink-0" />
                        <span className="truncate">{dest.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-white/10" />

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Admin Notes (Visible to User)</label>
                  <textarea 
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="input-dark w-full text-sm resize-none"
                    placeholder="Enter notes or pricing details..."
                  />
                </div>

                <div className="space-y-3">
                  <a 
                    href={`https://wa.me/${selectedTrip.user?.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg flex justify-center items-center gap-2 text-sm font-semibold transition-colors"
                  >
                    <FaWhatsapp className="text-lg" /> Contact on WhatsApp
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      disabled={updating}
                      onClick={() => handleUpdateStatus('Contacted')}
                      className="py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
                    >
                      Mark Contacted
                    </button>
                    <button 
                      disabled={updating}
                      onClick={() => handleUpdateStatus('Confirmed')}
                      className="py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors"
                    >
                      Mark Confirmed
                    </button>
                    <button 
                      disabled={updating}
                      onClick={() => handleUpdateStatus('Cancelled')}
                      className="py-2 col-span-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                    >
                      Cancel Request
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="glass p-6 text-center rounded-3xl border border-white/5 sticky top-4">
              <FiMessageCircle className="text-4xl text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">Select a trip request from the list to view details and manage it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
