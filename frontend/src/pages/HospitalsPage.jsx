import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  ChevronRight, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  BedDouble, 
  AlertCircle 
} from 'lucide-react';
import api from '../services/api';

const CITIES = ['All', 'Hyderabad', 'Bengaluru', 'Delhi', 'Chennai'];
const DEPARTMENTS = ['All', 'Cardiology', 'Neurology', 'General Medicine', 'Orthopedics', 'Pediatrics', 'Dermatology'];

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, [selectedCity, selectedDept]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      let url = '/hospitals';
      const params = new URLSearchParams();
      if (selectedCity !== 'All') params.append('city', selectedCity);
      if (selectedDept !== 'All') params.append('department', selectedDept);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      setHospitals(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter(h => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-[85vh] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Indian Super-Specialty Network</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Partner Hospitals & Medical Centres
          </h1>
          <p className="text-xs text-slate-500">
            Explore verified hospital facilities across Hyderabad, Bengaluru, Delhi, and Chennai with direct OPD slot booking.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital name, address, or landmark..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* City Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCity === city
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Departments:</span>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-teal-100 text-teal-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Academic Disclaimer Box */}
        <div className="p-3.5 bg-slate-100 rounded-2xl text-xs text-slate-600 flex items-start gap-2.5 border border-slate-200">
          <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> Hospital information shown for demonstration purposes. CareWave is not affiliated with the hospitals listed unless explicitly stated. Doctor schedules are simulated demo data.
          </span>
        </div>

        {/* Hospitals Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading hospitals directory...</div>
        ) : filteredHospitals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No hospitals matched your filters</h3>
            <p className="text-xs text-slate-500">Try selecting a different city or clearing your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-teal-400 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image banner */}
                  <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={hosp.image}
                      alt={hosp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-xs flex items-center gap-1">
                      ★ {hosp.rating}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold text-white">
                      {hosp.city}, {hosp.state}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                        {hosp.type}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1.5 group-hover:text-teal-700 transition-colors">
                        {hosp.name}
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p className="flex items-start gap-1.5 text-slate-500 line-clamp-2 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        {hosp.address}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {hosp.phone}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-teal-600" />
                          {hosp.totalBeds} Beds
                        </span>
                        {hosp.emergencyAvailable && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" /> 24x7 Emergency
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Department Badges */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {(hosp.departments || []).slice(0, 4).map((dept) => (
                        <span
                          key={dept}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          {dept}
                        </span>
                      ))}
                      {(hosp.departments?.length || 0) > 4 && (
                        <span className="text-[10px] text-slate-400 px-1 py-0.5">
                          +{hosp.departments.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <Link
                    to={`/book?hospitalId=${hosp.id}`}
                    className="w-full py-2.5 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 group-hover:bg-teal-600 group-hover:text-white"
                  >
                    Book OPD Consultation
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default HospitalsPage;
