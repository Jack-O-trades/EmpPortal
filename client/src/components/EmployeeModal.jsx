import React from 'react';
import { X, ExternalLink, Phone, Calendar, Briefcase, MapPin } from 'lucide-react';

export default function EmployeeModal({ employee, onClose }) {
  if (!employee) return null;

  // Normalize keys to lowercase for flexible Excel column matching
  const get = (...keys) => {
    for (const key of keys) {
      const found = Object.entries(employee).find(
        ([k]) => k.toLowerCase().replace(/[\s_]/g, '') === key.toLowerCase().replace(/[\s_]/g, '')
      );
      if (found && found[1] != null && found[1] !== '') return found[1];
    }
    return null;
  };

  const name        = get('name') || 'Unknown';
  const designation = get('designation', 'post', 'jobTitle', 'position', 'role') || 'N/A';
  const exitDate    = get('exitdate', 'exitDate', 'DateofRetirement', 'retirementdate', 'dateofretirement', 'lastworkingday', 'enddate') || 'N/A';
  const phone       = get('phone', 'phonenumber', 'mobile', 'contact', 'mobilenumber', 'contactnumber') || 'N/A';
  const place       = get('place', 'location', 'posting', 'unit') || '';

  const handleViewMore = () => {
    window.open(`/employee/${employee._id}`, '_blank');
  };

  const InfoRow = ({ icon: Icon, label, value, color = 'indigo' }) => (
    <div className={`flex items-center gap-4 p-4 bg-${color}-50 rounded-2xl`}>
      <div className={`p-2.5 bg-white rounded-xl shadow-sm flex-shrink-0`}>
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-base font-bold text-gray-900 truncate" title={value}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">

        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10">

          {/* Header gradient strip */}
          <div className="h-28 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Avatar */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2">
            <div className="h-28 w-28 rounded-3xl bg-white shadow-xl border-4 border-white flex items-center justify-center text-indigo-700 font-black text-5xl bg-gradient-to-br from-indigo-50 to-indigo-100 overflow-hidden">
              {employee.image_url ? (
                <img src={employee.image_url} alt={name} className="w-full h-full object-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pt-20 pb-8 text-center">
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">{name}</h3>
            {place && (
              <p className="text-indigo-500 font-semibold mt-1 flex items-center justify-center gap-1.5">
                <MapPin className="h-4 w-4" /> {place}
              </p>
            )}
          </div>

          <div className="px-6 pb-6 space-y-3">
            <InfoRow icon={Briefcase}  label="Designation"  value={designation} color="indigo"  />
            <InfoRow icon={MapPin}     label="Category"     value={employee.source_sheet || 'General'} color="blue"  />
            <InfoRow icon={Calendar}   label="Exit Date"    value={exitDate}    color="purple"  />
            <InfoRow icon={Phone}      label="Phone Number" value={phone}       color="cyan"    />
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleViewMore}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
            >
              View More <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
