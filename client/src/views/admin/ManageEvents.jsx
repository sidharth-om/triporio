import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { eventService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const categories = ['Festival', 'Cultural', 'Nature', 'Food', 'Temple', 'Monsoon'];

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', shortDescription: '', description: '', category: 'Cultural',
    location: '', season: '', months: '', highlights: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await eventService.getAll();
      setEvents(data.events);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = (evt = null) => {
    if (evt) {
      setFormData({
        name: evt.name,
        shortDescription: evt.shortDescription,
        description: evt.description,
        category: evt.category,
        location: evt.location,
        season: evt.season,
        months: evt.months.join(', '),
        highlights: evt.highlights.join(', ')
      });
      setEditingId(evt._id);
    } else {
      setFormData({
        name: '', shortDescription: '', description: '', category: 'Cultural',
        location: '', season: '', months: '', highlights: ''
      });
      setEditingId(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'months' || key === 'highlights') {
          const arr = formData[key].split(',').map(s => s.trim()).filter(Boolean);
          data.append(key, JSON.stringify(arr));
        } else {
          data.append(key, formData[key]);
        }
      });
      if (imageFile) data.append('image', imageFile);

      if (editingId) {
        await eventService.update(editingId, data);
        toast.success('Event updated');
      } else {
        await eventService.create(data);
        toast.success('Event created');
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <span className="flex flex-col gap-3 p-1">
        <span className="text-sm font-medium text-slate-200">
          Are you sure you want to delete this event?
        </span>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await eventService.delete(id);
                toast.success('Event deleted');
                fetchEvents();
              } catch (error) {
                toast.error('Failed to delete');
              }
            }}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 5000 });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Manage Events</h1>
          <p className="text-slate-400 text-sm">Add or edit seasonal & cultural events.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary py-2 px-4 text-sm">
          <FiPlus /> Add New
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-slate-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Event Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Season</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map(evt => (
                <tr key={evt._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={evt.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-white/10" onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                      <span className="font-medium text-white">{evt.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{evt.category}</td>
                  <td className="px-6 py-4">{evt.location}</td>
                  <td className="px-6 py-4">{evt.season}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(evt)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors mr-2">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDelete(evt._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl w-full max-w-2xl my-8 relative">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-2">
                <FiX className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-dark w-full" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-dark w-full">
                    {categories.map(c => <option key={c} value={c} className="bg-[#0a0f1e]">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input-dark w-full" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Season</label>
                  <input required type="text" placeholder="e.g. Winter, Monsoon" value={formData.season} onChange={e => setFormData({...formData, season: e.target.value})} className="input-dark w-full" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Short Description</label>
                <input required type="text" maxLength={100} value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="input-dark w-full" />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Full Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-dark w-full resize-none"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Months (comma separated)</label>
                  <input type="text" placeholder="e.g. June, July, August" value={formData.months} onChange={e => setFormData({...formData, months: e.target.value})} className="input-dark w-full" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Highlights (comma separated)</label>
                  <input type="text" value={formData.highlights} onChange={e => setFormData({...formData, highlights: e.target.value})} className="input-dark w-full" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Image Upload</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500/20 file:text-green-400 hover:file:bg-green-500/30" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-sm">
                  {submitting ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
