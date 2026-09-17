import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Activity, 
  Building2, 
  Stethoscope, 
  Play, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  BellRing,
  Sparkles
} from 'lucide-react';
import api from '../services/api';

const QueuePage = () => {
  const { appointmentId } = useParams();
  const targetApptId = appointmentId || 'appt-demo-1';

  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQueueStatus();
    // Auto-poll every 12 seconds for simulated changes
    const interval = setInterval(fetchQueueStatus, 12000);
    return () => clearInterval(interval);
  }, [targetApptId]);

  const fetchQueueStatus = async () => {
    try {
      const res = await api.get(`/queue/${targetApptId}`);
      if (res.data?.data) {
        setQueueData(res.data.data);
      }
    } catch (err) {
      console.warn('Queue fetch error:', err);
      setError('Unable to load queue status for this appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateAdvance = async () => {
    setAdvancing(true);
    setSimulationMessage('');
    try {
      const res = await api.post(`/queue/${targetApptId}/simulate-advance`);
      if (res.data?.data) {
        setSimulationMessage('Queue advanced! Next token called by attending doctor.');
        // Refetch full data with hospital info
        await fetchQueueStatus();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdvancing(false);
      setTimeout(() => setSimulationMessage(''), 5000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'YOUR TURN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            YOUR TURN - PROCEED TO ROOM
          </span>
        );
      case 'ALMOST YOUR TURN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            ALMOST YOUR TURN (PREPARE)
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            CONSULTATION COMPLETED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            WAITING IN OPD QUEUE
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Connecting to CareWave live queue engine...</p>
      </div>
    );
  }

  const peopleAhead = queueData?.peopleAhead ?? 0;
  const progressPercent = Math.min(100, Math.max(15, 100 - (peopleAhead * 18)));

  return (
    <div className="min-h-[85vh] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Academic Notice Banner */}
        <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong>Demonstration Notice:</strong> Demo queue data – not a live hospital queue. Waiting times and queue positions are realistically simulated for academic and presentation evaluation.
          </div>
          <button
            onClick={fetchQueueStatus}
            className="shrink-0 p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold"
            title="Refresh queue"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        {/* Live Presentation Demo Controller */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Interactive Simulator Control
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Live OPD Queue Simulation</h3>
            <p className="text-xs text-slate-300">
              Click the button to simulate the attending physician calling the next patient.
            </p>
          </div>

          <button
            onClick={handleSimulateAdvance}
            disabled={advancing || peopleAhead === 0}
            className="shrink-0 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-40"
          >
            <Play className={`w-4 h-4 fill-current ${advancing ? 'animate-spin' : ''}`} />
            {advancing ? 'Advancing Queue...' : 'Simulate Call Next Patient'}
          </button>
        </div>

        {simulationMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <BellRing className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{simulationMessage}</span>
          </div>
        )}

        {/* Queue Board Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/90 space-y-8">
          
          {/* Top Bar: Hospital & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>{queueData?.hospitalName || 'Apollo Hospitals, Jubilee Hills'}</span>
                <span>•</span>
                <span>{queueData?.hospitalCity || 'Hyderabad'}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {queueData?.doctorName || 'Dr. Priya Sharma'}
              </h2>
              <p className="text-xs text-teal-700 font-semibold flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5" />
                {queueData?.doctorSpecialization || 'General Medicine'} • {queueData?.counterRoom || 'Room 204'}
              </p>
            </div>

            <div className="self-start sm:self-auto">
              {getStatusBadge(queueData?.status)}
            </div>
          </div>

          {/* Big Digital Display Board */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Your Token */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 sm:p-8 rounded-3xl border border-teal-200 text-center space-y-2 relative overflow-hidden">
              <div className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-100/80 px-2 py-0.5 rounded-full">
                Your Token
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-800">Your OPD Token</p>
              <p className="text-5xl sm:text-6xl font-black text-teal-700 tracking-tight">
                {queueData?.tokenNumber || 'A-12'}
              </p>
              <p className="text-xs font-semibold text-teal-900/80 pt-1">
                Appt: {queueData?.appointment?.appointmentCode || 'CW-HYD-1029'}
              </p>
            </div>

            {/* Currently Serving */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 text-center space-y-2 relative overflow-hidden">
              <div className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                In Consultation
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Currently Serving</p>
              <p className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                {queueData?.currentlyServing || 'A-09'}
              </p>
              <p className="text-xs font-medium text-slate-400 pt-1">
                {queueData?.counterRoom || 'OPD Room 204'}
              </p>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <Users className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <p className="text-[10px] uppercase font-bold text-slate-400">Patients Ahead</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                {peopleAhead}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[10px] uppercase font-bold text-slate-400">Estimated Wait</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">
                {queueData?.estimatedWaitMinutes ?? 15} Mins
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <Activity className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-[10px] uppercase font-bold text-slate-400">Avg Consult Pace</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                {queueData?.avgConsultationMinutes || 10} Mins
              </p>
            </div>
          </div>

          {/* Visual Queue Line */}
          <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Queue Progress Visualization</span>
              <span className="font-bold text-teal-700">{progressPercent}% Towards Consultation</span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Token {queueData?.currentlyServing} (Inside)</span>
              <span>{peopleAhead} Patients in Line</span>
              <span className="font-bold text-teal-800">Your Token {queueData?.tokenNumber}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <Link to="/dashboard" className="text-slate-500 hover:text-slate-800 font-semibold">
              ← Return to Dashboard
            </Link>
            <Link to="/appointments" className="text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1">
              View All My Appointments <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default QueuePage;
