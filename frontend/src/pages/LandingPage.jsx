import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ShieldCheck, 
  Users, 
  Building2, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  AlertCircle,
  MapPin,
  ChevronRight,
  TrendingDown,
  Stethoscope,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LandingPage = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    hospitalsCount: 12,
    doctorsCount: 20,
    citiesCovered: 4,
    avgWaitReductionPercent: 42
  });
  const [featuredHospitals, setFeaturedHospitals] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, hospRes] = await Promise.all([
          api.get('/notifications/stats').catch(() => null),
          api.get('/hospitals?city=Hyderabad').catch(() => null)
        ]);
        if (statsRes?.data?.data) setStats(statsRes.data.data);
        if (hospRes?.data?.data) setFeaturedHospitals(hospRes.data.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const handleDemoAccess = async () => {
    const res = await demoLogin();
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-teal-50/70 via-white to-slate-50 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 border border-teal-300/60 text-teal-800 text-xs font-semibold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Next-Generation OPD Orchestration</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Healthcare should be about <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600">care</span>, not waiting.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                CareWave transforms chaotic hospital waiting rooms into intelligent, digital queues. Book appointments with India's premier super-specialty hospitals, track your live token number, and arrive exactly when the doctor is ready.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    Go to Patient Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={handleDemoAccess}
                      className="w-full sm:w-auto px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Sparkles className="w-4 h-4 text-teal-200" />
                      1-Click Demo Login
                    </button>
                    <Link
                      to="/book"
                      className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Calendar className="w-4 h-4 text-teal-600" />
                      Book Consultation
                    </Link>
                  </>
                )}
                <Link
                  to="/hospitals"
                  className="w-full sm:w-auto px-5 py-3.5 text-slate-600 hover:text-teal-700 font-medium text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  Browse Hospitals
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Verified Indian Hospital Profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Real-time Wait Estimation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Zero-Crowd OPD Experience</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Decorative glow */}
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>

                {/* Queue Card Visual */}
                <div className="relative bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/80 border border-slate-200/90 space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Live OPD Queue</h4>
                        <p className="text-xs text-slate-500">Apollo Hospitals, Jubilee Hills</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      WAITING
                    </span>
                  </div>

                  {/* Token Big Display */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-center p-2 border-r border-slate-200">
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Your Token</p>
                      <p className="text-3xl font-extrabold text-teal-700 mt-0.5">A-12</p>
                      <p className="text-[10px] text-teal-600 font-semibold mt-1">Rahul Sharma</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Now Serving</p>
                      <p className="text-3xl font-extrabold text-slate-800 mt-0.5">A-09</p>
                      <p className="text-[10px] text-slate-500 mt-1">Dr. Priya Sharma</p>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-teal-600" />
                      <div>
                        <p className="text-slate-400 text-[10px]">Ahead of You</p>
                        <p className="font-bold text-slate-800 text-sm">3 Patients</p>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-slate-400 text-[10px]">Est. Wait Time</p>
                        <p className="font-bold text-slate-800 text-sm">~15 Mins</p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Stepper */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Queue Progress</span>
                      <span className="text-teal-700 font-semibold">75% Complete</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div className="pt-1 text-center">
                    <p className="text-[11px] text-slate-400 italic">
                      Simulated queue update engine • Real-time patient flow
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-teal-700">{stats.hospitalsCount}+</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Premier Indian Hospitals</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-teal-700">{stats.doctorsCount}+</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Specialist Doctors</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-emerald-600">42%</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Average Wait Reduction</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-teal-700">{stats.citiesCovered}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Major Metro Hubs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Why CareWave
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for patients who value their time and health
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Traditional hospital visits involve long hours sitting in crowded waiting rooms. CareWave introduces transparent, predictable appointment and queue tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md hover:border-teal-300 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">7-Step Seamless Booking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by city, select verified Indian hospitals, pick your department and doctor, and reserve an exact time slot in under 60 seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md hover:border-teal-300 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Smart Queue Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live simulated token board shows your position, currently serving number, and exactly how many patients are ahead of you in the OPD block.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md hover:border-teal-300 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Predictive Wait Times</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive estimated consultation times dynamically calculated from queue movement, eliminating the anxiety of sitting in waiting corridors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Indian Hospital Network Preview */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600">
                Partner Hubs
              </h2>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Premier Indian Healthcare Institutions
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Demo profiles for major super-specialty hospitals in Hyderabad, Bengaluru, Delhi & Chennai
              </p>
            </div>
            <Link
              to="/hospitals"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              View All 12 Hospitals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all"
              >
                <div className="h-44 w-full relative overflow-hidden bg-slate-200">
                  <img
                    src={hosp.image}
                    alt={hosp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-xs flex items-center gap-1">
                    ★ {hosp.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold text-white">
                    {hosp.city}, {hosp.state}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                    {hosp.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {hosp.address}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200/80 text-xs">
                    <span className="text-teal-700 font-semibold">
                      {hosp.departments?.length || 6} Departments
                    </span>
                    <Link
                      to={`/book?hospitalId=${hosp.id}`}
                      className="font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1"
                    >
                      Book OPD
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <HeartHandshake className="w-4 h-4" />
            Empowering Patients Across India
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience frictionless hospital visits?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Join CareWave today and say goodbye to the uncertainty of long clinic queues. Try our instant demo with pre-populated Indian hospital consultations.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDemoAccess}
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Launch Demo Patient Portal
            </button>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all text-sm"
            >
              Register New Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
