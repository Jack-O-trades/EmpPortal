import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, ArrowRight } from 'lucide-react';

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get('/api/places/');
        setPlaces(res.data);
      } catch (err) {
        console.error("Failed to fetch places", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Employee Hub</h1>
        <p className="mt-2 text-gray-500">Select a location to view its employees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place, idx) => (
          <Link 
            key={idx} 
            to={`/places/${encodeURIComponent(place)}`}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all transform hover:-translate-y-1 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <MapPin className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{place}</h3>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
        {places.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No places found. Please upload an Excel file first.</p>
          </div>
        )}
      </div>
    </div>
  );
}
