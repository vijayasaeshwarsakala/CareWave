import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight, 
  PlusCircle, 
  Bell, 
  Activity, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  MapPin,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [activeQueue, setActiveQueue] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingCount: 1,
    completedCount: 2,
    avgWaitSaved: '35 mins'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(false);
    try {
      const [apptRes, notifRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/notifications')
      ]);

      const appts = apptRes.data?.data || [];
      setAppointments(appts);
      setNotifications(notifRes.data?.data || []);

      // Find the primary active confirmed appointment
      const upcoming = appts.find(a => a.status === 'CONFIRMED');
      if (upcoming) {
        // Fetch queue status for this upcoming appointment
        try {
          const qRes = await api.get(`/queue/${upcoming._id || upcoming.id}`);
          if (qRes.data?.data) {
            setActiveQueue(qRes.data.data);
          }
        } catch (err) {
          console.warn('Queue fetch error:', err);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointment = appointments.find(a => a.status === 'CONFIRMED');

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Patient Health Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Rahul Sharma'}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Track your active OPD queues in real time, view upcoming visits, and consult specialists across India's leading medical centres.
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/book"
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Book Consultation
              </Link>
              {upcomingAppointment && (
                <Link
                  to={`/queue/${upcomingAppointment._id || upcomingAppointment.id}`}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-teal-300" />
                  Live Queue
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Highlighted Upcoming Visit & Active Queue Widget */}
        {upcomingAppointment ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Activity className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Upcoming Consultation & Live Queue</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Appointment Code: <span className="font-mono font-semibold text-slate-700">{upcomingAppointment.appointmentCode}</span>
                  </p>
                </div>
              </div>

              <Link
                to={`/queue/${upcomingAppointment._id || upcomingAppointment.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-xl border border-teal-200 transition-all self-start sm:self-auto"
              >
                Track Live OPD Queue
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Content Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Doctor & Hospital Details */}
              <div className="md:col-span-5 space-y-3 border-b md:border-b-0 md:border-r border-slate-100 pb-5 md:pb-0 md:pr-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Attending Specialist</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">{upcomingAppointment.doctorName}</p>
                  <p className="text-xs text-slate-500 font-medium">{upcomingAppointment.department}</p>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hospital Facility</p>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    {upcomingAppointment.hospitalName}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {upcomingAppointment.appointmentDate}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {upcomingAppointment.timeSlot}
                  </span>
                </div>
              </div>

              {/* Real-time Queue Status */}
              <div className="md:col-span-7 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Your Token</p>
                    <p className="text-2xl font-black text-teal-700 mt-0.5">
                      {activeQueue?.tokenNumber || 'A-12'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Now Serving</p>
                    <p className="text-2xl font-black text-slate-800 mt-0.5">
                      {activeQueue?.currentlyServing || 'A-09'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">People Ahead</p>
                    <p className="text-2xl font-black text-amber-600 mt-0.5">
                      {activeQueue?.peopleAhead ?? 3}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Est. Wait Time</p>
                    <p className="text-2xl font-black text-emerald-600 mt-0.5">
                      {activeQueue?.estimatedWaitMinutes ?? 15}m
                    </p>
                  </div>
                </div>

                {/* Queue Progress Bar */}
                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Queue Status: <strong className="text-teal-700 font-bold">{activeQueue?.status || 'WAITING'}</strong>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Room: {activeQueue?.counterRoom || 'Room 204 (OPD Block A)'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(20, 100 - (activeQueue?.peopleAhead || 3) * 20)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No active appointments scheduled</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Book a consultation with our verified Indian hospital specialists to activate live queue tracking.
              </p>
            </div>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Book Your First Appointment
            </Link>
          </div>
        )}

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/book"
            className="group bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Book OPD</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">7-step doctor selection</p>
            </div>
          </Link>

          <Link
            to="/queue/appt-demo-1"
            className="group bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Live Queue</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Simulated tracker</p>
            </div>
          </Link>

          <Link
            to="/appointments"
            className="group bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">My Visits</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">History & manage</p>
            </div>
          </Link>

          <Link
            to="/hospitals"
            className="group bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Hospitals</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">12 Indian facilities</p>
            </div>
          </Link>
        </div>

        {/* Bottom Section: Recent History & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Appointments */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/90 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Recent Appointments</h3>
              <Link to="/appointments" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              {appointments.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No past visits recorded.</p>
              ) : (
                appointments.map((appt) => (
                  <div key={appt._id || appt.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{appt.doctorName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                          {appt.department}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{appt.hospitalName}</p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-xs font-medium text-slate-800">{appt.appointmentDate}</p>
                        <p className="text-[11px] text-slate-400">{appt.timeSlot}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        appt.status === 'CONFIRMED'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : appt.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* In-app Notifications Alert Box */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900">Notifications</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
                {notifications.length} Total
              </span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No notifications yet</p>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div key={n._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <p className="text-xs font-bold text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-slate-400 pt-0.5">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
