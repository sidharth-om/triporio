import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiX } from 'react-icons/fi';
import { destinationService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const categories = ['Beach', 'Hill Station', 'Wildlife', 'Heritage', 'Culture', 'Nature', 'Adventure'];

export default function ManageDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '', shortDescription: '', description: '', category: 'Beach',
    location: '', bestSeason: '', featured: false, highlights: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const { data } = await destinationService.getAll();
      setDestinations(data.destinations);
    } catch (error) {
      toast.error('Failed to fetch destinations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const openModal = (dest = null) => {
    if (dest) {
      setFormData({
        name: dest.name,
        shortDescription: dest.shortDescription,
        description: dest.description,
        category: dest.category,
        location: dest.location,
        bestSeason: dest.bestSeason,
        featured: dest.featured,
        highlights: dest.highlights.join(', ')
      });
      setEditingId(dest._id);
    } else {
      setFormData({
        name: '', shortDescription: '', description: '', category: 'Beach',
        location: '', bestSeason: '', featured: false, highlights: ''
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
        if (key === 'highlights') {
          const arr = formData.highlights.split(',').map(s => s.trim()).filter(Boolean);
          data.append(key, JSON.stringify(arr));
        } else {
          data.append(key, formData[key]);
        }
      });
      if (imageFile) data.append('image', imageFile);

      if (editingId) {
        await destinationService.update(editingId, data);
        toast.success('Destination updated');
      } else {
        await destinationService.create(data);
        toast.success('Destination created');
      }
      setIsModalOpen(false);
      fetchDestinations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving destination');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await destinationService.delete(id);
      toast.success('Destination deleted');
      fetchDestinations();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Manage Destinations</h1>
          <p className="text-slate-400 text-sm">Add, edit, or remove tourist spots.</p>
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
                <th className="px-6 py-4 font-semibold">Destination</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Featured</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {destinations.map(dest => (
                <tr key={dest._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={dest.image} 
                        alt="" 
                        className="w-10 h-10 rounded-lg object-cover bg-white/10"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                      />
                      <span className="font-medium text-white">{dest.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{dest.category}</td>
                  <td className="px-6 py-4">{dest.location}</td>
                  <td className="px-6 py-4">
                    {dest.featured ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-white/10 text-slate-400 rounded text-xs">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(dest)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors mr-2">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDelete(dest._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {destinations.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No destinations found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl w-full max-w-2xl my-8 relative">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Destination' : 'Add New Destination'}</h2>
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
                  <label className="block text-sm text-slate-400 mb-1">Best Season</label>
                  <input required type="text" placeholder="e.g. Oct to Mar" value={formData.bestSeason} onChange={e => setFormData({...formData, bestSeason: e.target.value})} className="input-dark w-full" />
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

              <div>
                <label className="block text-sm text-slate-400 mb-1">Highlights (comma separated)</label>
                <input type="text" placeholder="e.g. Trekking, Viewpoint, Waterfalls" value={formData.highlights} onChange={e => setFormData({...formData, highlights: e.target.value})} className="input-dark w-full" />
              </div>

              <div className="flex items-center gap-4 border border-white/10 p-4 rounded-xl">
                <div className="flex-1">
                  <label className="block text-sm text-slate-400 mb-1">Image Upload</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500/20 file:text-green-400 hover:file:bg-green-500/30" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 rounded bg-white/10 border-white/20 text-green-500 focus:ring-green-500 focus:ring-offset-gray-900" />
                  <label htmlFor="featured" className="text-sm text-slate-300">Featured</label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary py-2 px-4 text-sm">
                  {submitting ? 'Saving...' : 'Save Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
