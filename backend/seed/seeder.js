const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getStore, saveLocalStore, isUsingMongo } = require('../config/db');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Queue = require('../models/Queue');
const Notification = require('../models/Notification');

const hospitalsDataPath = path.join(__dirname, 'indianHospitals.json');

const seedData = async () => {
  try {
    const rawData = fs.readFileSync(hospitalsDataPath, 'utf8');
    const { hospitals, doctors } = JSON.parse(rawData);

    // Hash a demo password for the default test patient
    const salt = await bcrypt.genSalt(10);
    const demoHashedPassword = await bcrypt.hash('CareWave@123', salt);

    const demoUser = {
      _id: 'user-demo-patient',
      name: 'Rahul Sharma',
      email: 'rahul.patient@carewave.in',
      phone: '+91 98765 43210',
      password: demoHashedPassword,
      role: 'patient',
      city: 'Hyderabad',
      createdAt: new Date().toISOString()
    };

    const demoAppointment = {
      _id: 'appt-demo-1',
      appointmentCode: 'CW-HYD-1029',
      userId: 'user-demo-patient',
      userName: 'Rahul Sharma',
      userPhone: '+91 98765 43210',
      hospitalId: 'hosp-apollo-hyd',
      hospitalName: 'Apollo Hospitals, Jubilee Hills',
      doctorId: 'doc-1',
      doctorName: 'Dr. Priya Sharma',
      department: 'General Medicine',
      appointmentDate: new Date().toISOString().split('T')[0],
      timeSlot: '10:30 AM',
      status: 'CONFIRMED',
      reason: 'Periodic Health Checkup & BP Review',
      queueId: 'queue-demo-1',
      createdAt: new Date().toISOString()
    };

    const demoQueue = {
      _id: 'queue-demo-1',
      appointmentId: 'appt-demo-1',
      hospitalId: 'hosp-apollo-hyd',
      doctorId: 'doc-1',
      tokenNumber: 'A-12',
      currentlyServing: 'A-08',
      peopleAhead: 4,
      estimatedWaitMinutes: 15,
      avgConsultationMinutes: 10,
      status: 'WAITING',
      counterRoom: 'Room 204 (OPD Block A)',
      lastUpdated: new Date().toISOString()
    };

    const demoNotifications = [
      {
        _id: 'notif-demo-1',
        userId: 'user-demo-patient',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. Priya Sharma at Apollo Hospitals is confirmed for today at 10:30 AM.',
        type: 'APPOINTMENT_CONFIRMED',
        isRead: false,
        link: '/queue/appt-demo-1',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'notif-demo-2',
        userId: 'user-demo-patient',
        title: 'Queue Active Notice',
        message: 'Your queue token A-12 is currently in queue. 4 patients ahead of you. Estimated wait: 15 mins.',
        type: 'QUEUE_UPDATE',
        isRead: false,
        link: '/queue/appt-demo-1',
        createdAt: new Date().toISOString()
      }
    ];

    // Seed local fallback store
    const store = getStore();
    store.hospitals = hospitals;
    store.doctors = doctors;
    if (!store.users.some(u => u.email === demoUser.email)) {
      store.users.push(demoUser);
    }
    if (!store.appointments.some(a => a.appointmentCode === demoAppointment.appointmentCode)) {
      store.appointments.push(demoAppointment);
    }
    if (!store.queues.some(q => q.appointmentId === demoQueue.appointmentId)) {
      store.queues.push(demoQueue);
    }
    if (store.notifications.length === 0) {
      store.notifications = demoNotifications;
    }
    saveLocalStore();
    console.log(`[CareWave Seed] Local fallback store seeded with ${hospitals.length} hospitals and ${doctors.length} doctors.`);

    // If MongoDB is connected, also seed MongoDB collections
    if (isUsingMongo()) {
      await Hospital.deleteMany({});
      await Hospital.insertMany(hospitals);

      await Doctor.deleteMany({});
      await Doctor.insertMany(doctors);

      const existingUser = await User.findOne({ email: demoUser.email });
      if (!existingUser) {
        await User.create(demoUser);
      }

      const existingAppt = await Appointment.findOne({ appointmentCode: demoAppointment.appointmentCode });
      if (!existingAppt) {
        await Appointment.create(demoAppointment);
        await Queue.create(demoQueue);
      }

      console.log(`[CareWave Seed] MongoDB seeded successfully with ${hospitals.length} hospitals and ${doctors.length} doctors.`);
    }
  } catch (error) {
    console.error('[CareWave Seed Error]:', error.message);
  }
};

module.exports = seedData;
