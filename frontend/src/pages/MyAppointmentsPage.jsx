import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Building2, 
  User, 
  Activity, 
  PlusCircle, 
  XCircle, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../services/api';

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'all'
  const [cancelModal, setCancelModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/appointments/${id}/cancel`);
      setAppointments(prev =>
        prev.map(a => (a._id === id || a.id === id) ? { ...a, status: 'CANCELLED' } : a)
      );
      setCancelModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(a => {
    if (activeTab === 'upcoming') {
      return a.status === 'CONFIRMED';
    }
    return true;
  });

  return (
    <div className="min-h-[85vh] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Appointments
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your healthcare consultations and track your live OPD token positions
            </p>
          </div>

          <Link
            to="/book"
            className="self-start sm:self-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Book New Visit
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Upcoming Consultations ({appointments.filter(a => a.status === 'CONFIRMED').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            All Visit History ({appointments.length})
          </button>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading your consultations...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">No {activeTab} visits found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to schedule your next specialist doctor consultation?
              </p>
            </div>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              Book Appointment Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => (
              <div
                key={appt._id || appt.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 hover:border-teal-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                      {appt.appointmentCode}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      appt.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : appt.status === 'CANCELLED'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  {appt.queue && appt.status === 'CONFIRMED' && (
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl self-start sm:self-auto flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      Queue Token: {appt.queue.tokenNumber || 'A-12'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Doctor & Specialty</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{appt.doctorName}</p>
                    <p className="text-teal-600 font-semibold">{appt.department}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hospital Facility</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {appt.hospitalName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date & Slot</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {appt.appointmentDate} • {appt.timeSlot}
                    </p>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500 italic text-[11px]">
                    Reason: {appt.reason || 'Routine Checkup'}
                  </span>

                  <div className="flex items-center gap-3">
                    {appt.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => setCancelModal(appt)}
                          className="text-red-600 hover:text-red-700 font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Cancel Visit
                        </button>
                        <Link
                          to={`/queue/${appt._id || appt.id}`}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Track Live Queue
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center shadow-xl border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Cancel this Appointment?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel your consultation with <strong className="text-slate-800">{cancelModal.doctorName}</strong> on {cancelModal.appointmentDate}? Your queue token will be released.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancelModal(null)}
                className="w-full py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => handleCancelAppointment(cancelModal._id || cancelModal.id)}
                disabled={actionLoading}
                className="w-full py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyAppointmentsPage;
