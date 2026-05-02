import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, UserCircle, Calendar, MapPin, Briefcase } from 'lucide-react';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`/api/employees/${id}/`);
        setEmployee(res.data);
      } catch (err) {
        console.error(err);
        // navigate('/places');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Employee not found</h2>
        <Link to="/places" className="text-indigo-600 hover:underline mt-4 inline-block">Go back to Places</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600 transition-colors border border-gray-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900">Full Profile</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 absolute top-0 left-0 right-0 z-0"></div>
        
        <div className="relative z-10 px-8 pt-16 pb-8 sm:px-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8">
            <div className="h-32 w-32 rounded-3xl bg-white p-2 shadow-lg">
              <div className="h-full w-full rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-5xl">
                {employee.name ? employee.name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
            <div className="text-center sm:text-left pb-2">
              <h2 className="text-4xl font-extrabold text-gray-900">{employee.name || 'Unknown'}</h2>
              <p className="text-xl text-indigo-600 font-semibold mt-1 flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="h-5 w-5" /> {employee.place}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Core Details</h3>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <UserCircle className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">{employee.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Calendar className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Exit Date</p>
                  <p className="text-lg font-bold text-gray-900">{employee.exitDate || employee.exitdate || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">All Data Fields</h3>
              <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 gap-4">
                {Object.entries(employee).map(([key, value]) => {
                  if (['_id', 'name', 'place', 'exitDate', 'exitdate'].includes(key)) return null;
                  return (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                      <span className="text-gray-900 font-semibold text-lg">{value?.toString() || '-'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
