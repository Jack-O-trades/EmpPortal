import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Send, MapPin, Phone, Briefcase, FileText } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    designation: '',
    extra_notes: '',
    image: null
  });

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes/');
      setNotes(res.data.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('uploading');
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('phone', formData.phone);
      fd.append('address', formData.address);
      fd.append('designation', formData.designation);
      fd.append('extra_notes', formData.extra_notes);
      if (formData.image) {
        fd.append('image', formData.image);
      }

      const res = await axios.post('/api/notes/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setStatus('success');
      setMessage(res.data.message);
      setFormData({ name: '', phone: '', address: '', designation: '', extra_notes: '', image: null });
      fetchNotes(); // refresh notes list
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Failed to add note');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Notes & Entries</h1>
        <p className="text-lg text-gray-500">Capture additional details, documents, or photos.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter New Note</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Name..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Phone Number..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
              <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Address..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Designation</label>
              <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Designation..." />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Extra Notes</label>
            <textarea value={formData.extra_notes} onChange={e => setFormData({...formData, extra_notes: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none min-h-[100px]" placeholder="Type your notes here..."></textarea>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="w-full sm:w-auto relative group">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={e => setFormData({...formData, image: e.target.files[0]})} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button type="button" className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${formData.image ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <Camera className="h-5 w-5" />
                {formData.image ? 'Image Ready' : 'Add Picture'}
              </button>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {message && status !== 'idle' && <p className={`text-sm font-bold ${status==='error'?'text-red-500':'text-green-500'}`}>{message}</p>}
              <button disabled={status === 'uploading' || (!formData.name && !formData.extra_notes && !formData.image)} type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2">
                <Send className="h-5 w-5" /> {status === 'uploading' ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Recent Notes</h2>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center p-8 text-gray-500 bg-white rounded-2xl shadow-sm">No notes found. Create one above!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {note.image_url && (
                  <div className="h-48 w-full bg-gray-100 overflow-hidden">
                    <img src={note.image_url} alt="Note Attachment" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 space-y-4">
                  {(note.name || note.designation) && (
                    <div className="border-b border-gray-50 pb-3">
                      {note.name && <h3 className="text-xl font-extrabold text-gray-900">{note.name}</h3>}
                      {note.designation && <p className="text-indigo-600 font-semibold text-sm flex items-center gap-1 mt-1"><Briefcase className="h-4 w-4"/> {note.designation}</p>}
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {note.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> {note.phone}</p>}
                    {note.address && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> {note.address}</p>}
                  </div>
                  
                  {note.extra_notes && (
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-800 italic flex items-start gap-2">
                      <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="whitespace-pre-wrap">{note.extra_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
