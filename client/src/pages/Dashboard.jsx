import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileSpreadsheet, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('manual'); // manual | upload

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    exitDate: '',
    address: '',
    designation: '',
    place: '',
    image: null
  });

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) setFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file.");
    if (!locationName.trim()) return setMessage("Please enter a location name.");
    
    setStatus('uploading');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('location', locationName.trim());
    
    try {
      // relative api path for vercel
      const res = await axios.post('/api/upload/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus('success');
      setMessage(res.data.message);
      setFile(null);
      setLocationName('');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Upload failed');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setStatus('uploading');
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('place', formData.place);
      fd.append('phone', formData.phone);
      fd.append('exitDate', formData.exitDate);
      fd.append('address', formData.address);
      fd.append('designation', formData.designation);
      if (formData.image) {
        fd.append('image', formData.image);
      }

      const res = await axios.post('/api/manual-entry/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
      setMessage(res.data.message);
      setFormData({ name: '', phone: '', exitDate: '', address: '', designation: '', place: '', image: null });
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Failed to enter data');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Enter Data</h1>
        <p className="text-lg text-gray-500">Add new employees manually or upload an Excel sheet.</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => setMode('manual')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${mode === 'manual' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Manual Entry
        </button>
        <button 
          onClick={() => setMode('upload')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${mode === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Excel Upload
        </button>
      </div>

      {mode === 'manual' ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location/Place *</label>
                <input required type="text" value={formData.place} onChange={e => setFormData({...formData, place: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="e.g. Kaniha" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Designation</label>
                <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="e.g. Manager" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Exit / Retirement Date</label>
                <input type="date" value={formData.exitDate} onChange={e => setFormData({...formData, exitDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="+1234567890" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="123 Main St..." />
              </div>
              <div className="md:col-span-2 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center">
                <label className="block text-sm font-bold text-indigo-900 mb-2">Employee Photo (Camera or File)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  onChange={e => setFormData({...formData, image: e.target.files[0]})} 
                  className="w-full max-w-sm"
                />
                <p className="text-xs text-indigo-500 mt-2 text-center">On a phone, this will let you open the camera directly.</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex justify-end items-center gap-4">
              {message && <p className={`text-sm font-bold ${status==='error'?'text-red-500':'text-green-500'}`}>{message}</p>}
              <button disabled={status === 'uploading'} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center gap-2">
                <PlusCircle className="h-5 w-5" /> Save Entry
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 max-w-xl mx-auto">
            <label className="text-sm font-bold text-gray-700">Set Location for this Excel Data *</label>
            <input 
              type="text" 
              placeholder="e.g. Kaniha, NTPC..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>

          <div 
            className="relative flex flex-col items-center justify-center p-16 border-4 border-dashed border-gray-200 rounded-3xl bg-white hover:bg-gray-50 transition-colors group cursor-pointer max-w-2xl mx-auto"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="text-center z-10 flex flex-col items-center gap-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <FileSpreadsheet className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-800">{file.name}</p>
                  <p className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button onClick={() => setFile(null)} className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
              </div>
            ) : (
              <div className="text-center z-10 flex flex-col items-center gap-4">
                <div className="p-6 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-16 w-16 text-indigo-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-gray-700">Drag & drop your .xlsx file here</p>
                  <p className="text-gray-500">or click to browse from your computer</p>
                </div>
                <input type="file" accept=".xlsx, .xls" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            {message && <p className={`text-sm font-bold ${status==='error'?'text-red-500':'text-green-500'}`}>{message}</p>}
            {file && locationName && (
              <button disabled={status === 'uploading'} onClick={handleUpload} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 w-full max-w-xs flex items-center justify-center gap-2">
                <UploadCloud className="h-5 w-5" /> Process Excel File
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
