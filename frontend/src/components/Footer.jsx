import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <div className="relative flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-white/20" />
                  <Activity className="w-3.5 h-3.5 text-white absolute stroke-[2.5]" />
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Care<span className="text-teal-400">Wave</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              CareWave is an intelligent healthcare queue & appointment orchestration platform engineered to eliminate waiting-room congestion and elevate the Indian hospital patient experience.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Full-Stack Prototype & Academic MVP</span>
            </div>
          </div>

          {/* Col 2: Hospital Network */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Partner Hubs (Demo)
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-slate-200 transition-colors">Apollo Hospitals (Hyderabad, BLR, Chennai)</span></li>
              <li><span className="hover:text-slate-200 transition-colors">AIIMS (New Delhi & Bibinagar)</span></li>
              <li><span className="hover:text-slate-200 transition-colors">Fortis Hospitals (Bengaluru & Delhi)</span></li>
              <li><span className="hover:text-slate-200 transition-colors">Manipal & Narayana Health (Bengaluru)</span></li>
              <li><span className="hover:text-slate-200 transition-colors">KIMS, Yashoda & CARE (Hyderabad)</span></li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/hospitals" className="hover:text-teal-400 transition-colors">Hospitals Directory</Link></li>
              <li><Link to="/book" className="hover:text-teal-400 transition-colors">Book Consultation</Link></li>
              <li><Link to="/queue/appt-demo-1" className="hover:text-teal-400 transition-colors">Live Queue Tracker</Link></li>
              <li><Link to="/dashboard" className="hover:text-teal-400 transition-colors">Patient Dashboard</Link></li>
              <li><Link to="/appointments" className="hover:text-teal-400 transition-colors">My Appointments</Link></li>
            </ul>
          </div>

          {/* Col 4: Academic Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Disclaimer & Notice
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] leading-relaxed text-slate-300">
              <p className="font-semibold text-teal-400 mb-1">Non-Affiliation Notice:</p>
              Hospital information shown for demonstration purposes. CareWave is not affiliated with the hospitals listed unless explicitly stated. Doctor availability and queue progression are realistically simulated.
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CareWave Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Node.js • Express • MongoDB • React • Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
