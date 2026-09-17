import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  Activity, 
  MapPin, 
  Stethoscope, 
  Sparkles,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CITIES = ['Hyderabad', 'Bengaluru', 'Delhi', 'Chennai'];

const BookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Current Step: 1 to 7
  const [currentStep, setCurrentStep] = useState(1);

  // Selection states
  const [selectedCity, setSelectedCity] = useState(user?.city || 'Hyderabad');
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [reason, setReason] = useState('Routine Consultation & General Health Checkup');

  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Initial load: Fetch hospitals for selected city
  useEffect(() => {
    fetchHospitals(selectedCity);
  }, [selectedCity]);

  // Check if hospitalId was passed via URL query
  useEffect(() => {
    const preselectHospId = searchParams.get('hospitalId');
    if (preselectHospId && hospitals.length > 0) {
      const found = hospitals.find(h => h.id === preselectHospId);
      if (found) {
        setSelectedHospital(found);
        setCurrentStep(3); // jump to department
      }
    }
  }, [searchParams, hospitals]);

  const fetchHospitals = async (city) => {
    try {
      const res = await api.get(`/hospitals?city=${city}`);
      setHospitals(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // When hospital selected, set departments
  const handleSelectHospital = (hosp) => {
    setSelectedHospital(hosp);
    setDepartments(hosp.departments || []);
    setSelectedDepartment('');
    setSelectedDoctor(null);
    setCurrentStep(3);
  };

  // When department selected, fetch doctors
  const handleSelectDepartment = async (dept) => {
    setSelectedDepartment(dept);
    setSelectedDoctor(null);
    setLoading(true);
    try {
      const res = await api.get(`/hospitals/${selectedHospital.id}/doctors?department=${dept}`);
      setDoctors(res.data?.data || []);
      setCurrentStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // When doctor selected
  const handleSelectDoctor = (doc) => {
    setSelectedDoctor(doc);
    // Generate dates (today and next 6 days)
    setCurrentStep(5);
  };

  // Helper for generating next 7 dates
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const handleConfirmBooking = async () => {
    setErrorMessage('');
    setLoading(true);

    try {
      const payload = {
        hospitalId: selectedHospital.id,
        doctorId: selectedDoctor.id,
        department: selectedDepartment,
        appointmentDate: selectedDate,
        timeSlot: selectedTimeSlot,
        reason
      };

      const res = await api.post('/appointments', payload);
      setBookingSuccess(res.data.data);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    'City',
    'Hospital',
    'Department',
    'Doctor',
    'Date',
    'Time',
    'Confirm'
  ];

  return (
    <div className="min-h-[85vh] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>OPD Appointment Wizard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Book Specialist Consultation
          </h1>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Reserve your consultation slot and instantly generate your live CareWave OPD queue token.
          </p>
        </div>

        {/* Progress Stepper Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between relative">
            {/* Step Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 w-full z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-500 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%` }}
            ></div>

            {stepsList.map((stepName, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <div key={stepName} className="relative z-10 flex flex-col items-center">
                  <div
                    onClick={() => {
                      if (isCompleted) setCurrentStep(stepNum);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-teal-600 text-white cursor-pointer hover:bg-teal-700'
                        : isCurrent
                        ? 'bg-white text-teal-700 ring-4 ring-teal-100 border-2 border-teal-600'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-medium mt-1.5 hidden sm:block ${
                    isCurrent ? 'text-teal-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Step Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">

          {/* STEP 1: Select City */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Step 1: Choose Healthcare City</h3>
                <p className="text-xs text-slate-500">Select the metro area where you wish to seek consultation</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setCurrentStep(2);
                    }}
                    className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center gap-3 ${
                      selectedCity === city
                        ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-200'
                        : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-teal-100/70 text-teal-700 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">{city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Hospital */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 2: Select Hospital ({selectedCity})</h3>
                  <p className="text-xs text-slate-500">Choose from top accredited hospitals in {selectedCity}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change City
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    onClick={() => handleSelectHospital(hosp)}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer space-y-3 bg-slate-50/50 hover:bg-white group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                          {hosp.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mt-1 inline-block">
                          {hosp.type}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md shrink-0">
                        ★ {hosp.rating}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">{hosp.address}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">{hosp.departments?.length} Departments</span>
                      <span className="font-bold text-teal-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Select Hospital <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Select Department */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 3: Select Department</h3>
                  <p className="text-xs text-slate-500">{selectedHospital?.name}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Hospital
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => handleSelectDepartment(dept)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition-all text-left space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm block group-hover:text-teal-700">
                      {dept}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Select Doctor */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 4: Select Specialist Doctor</h3>
                  <p className="text-xs text-slate-500">
                    {selectedDepartment} • {selectedHospital?.name}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Dept
                </button>
              </div>

              {doctors.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">No demo doctors currently active in this department</p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-xs text-teal-600 underline"
                  >
                    Choose another department
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectDoctor(doc)}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer space-y-3 group bg-white"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-800 font-bold text-sm flex items-center justify-center">
                            Dr
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700">
                              {doc.name}
                            </h4>
                            <p className="text-[11px] text-slate-500">{doc.qualification}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                          ★ {doc.rating}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-400">Experience</p>
                          <p className="font-semibold text-slate-700">{doc.experienceYears} Years</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">Consultation Fee</p>
                          <p className="font-semibold text-slate-700">₹{doc.consultationFee}</p>
                        </div>
                      </div>

                      <button className="w-full py-2 bg-teal-50 text-teal-700 text-xs font-bold rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        Select Doctor
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Select Date */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 5: Select Consultation Date</h3>
                  <p className="text-xs text-slate-500">With {selectedDoctor?.name}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Doctor
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableDates.map((item) => (
                  <button
                    key={item.iso}
                    onClick={() => {
                      setSelectedDate(item.iso);
                      setCurrentStep(6);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      selectedDate === item.iso
                        ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-300'
                        : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs text-slate-500 uppercase font-semibold">{item.dayName}</p>
                    <p className="text-base font-extrabold text-slate-800 mt-1">{item.formatted}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Select Time Slot */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 6: Pick Available Slot</h3>
                  <p className="text-xs text-slate-500">Date: {selectedDate}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Date
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(selectedDoctor?.timeSlots || ['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '03:30 PM', '04:30 PM']).map((slot) => (
                  <button
                    key={slot}
                    onClick={() => {
                      setSelectedTimeSlot(slot);
                      setCurrentStep(7);
                    }}
                    className={`p-3.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedTimeSlot === slot
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50/40'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Review & Confirm */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Step 7: Confirm Consultation Details</h3>
                <p className="text-xs text-slate-500">Review your appointment summary before booking</p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Hospital</p>
                    <p className="text-sm font-bold text-slate-800">{selectedHospital?.name}</p>
                    <p className="text-xs text-slate-500">{selectedHospital?.city}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Doctor & Specialty</p>
                    <p className="text-sm font-bold text-slate-800">{selectedDoctor?.name}</p>
                    <p className="text-xs text-teal-600 font-semibold">{selectedDepartment}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-200 text-xs">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Date</p>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Slot</p>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedTimeSlot}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Consultation Fee</p>
                    <p className="font-bold text-emerald-700 mt-0.5">₹{selectedDoctor?.consultationFee} (Pay at OPD)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Reason for Consultation
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Briefly state health concern or symptom"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Generating Appointment & Token...' : 'Confirm Appointment'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Booking Success Modal */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center border border-slate-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">Appointment Confirmed!</h3>
              <p className="text-xs text-slate-500">
                Your consultation has been booked and your OPD queue token is generated.
              </p>
            </div>

            {/* Token Badge */}
            <div className="bg-teal-50 rounded-2xl p-4 border border-teal-200 space-y-2">
              <p className="text-[11px] uppercase font-bold text-teal-800 tracking-wider">Your Live Queue Token</p>
              <p className="text-4xl font-black text-teal-700">{bookingSuccess.queue?.tokenNumber || 'A-12'}</p>
              <p className="text-xs text-slate-600">
                Estimated wait: <strong>{bookingSuccess.queue?.estimatedWaitMinutes || 15} mins</strong> • Room: {bookingSuccess.queue?.counterRoom}
              </p>
            </div>

            {/* Details table */}
            <div className="text-left text-xs bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Appointment Code:</span>
                <span className="font-mono font-bold text-slate-800">{bookingSuccess.appointment?.appointmentCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hospital:</span>
                <span className="font-semibold text-slate-800">{bookingSuccess.appointment?.hospitalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Doctor:</span>
                <span className="font-semibold text-slate-800">{bookingSuccess.appointment?.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Schedule:</span>
                <span className="font-semibold text-slate-800">{bookingSuccess.appointment?.appointmentDate} at {bookingSuccess.appointment?.timeSlot}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/queue/${bookingSuccess.appointment?._id}`)}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Track Live Queue Now
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingPage;
