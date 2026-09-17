const bcrypt = require('bcryptjs');
const { getStore, saveLocalStore, isUsingMongo } = require('../config/db');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Queue = require('../models/Queue');
const Notification = require('../models/Notification');

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const generateApptCode = (city) => {
  const codePrefix = city ? city.substring(0, 3).toUpperCase() : 'IND';
  return `CW-${codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
};
const generateTokenNumber = () => {
  const letters = ['A', 'B', 'C', 'D'];
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(10 + Math.random() * 40);
  return `${letter}-${num}`;
};

const dbService = {
  // USER OPERATIONS
  async findUserByEmail(email) {
    if (isUsingMongo()) {
      return await User.findOne({ email: email.toLowerCase() }).select('+password');
    }
    const store = getStore();
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (isUsingMongo()) {
      return await User.findById(id).select('-password');
    }
    const store = getStore();
    const user = store.users.find(u => u._id === id || u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async createUser({ name, email, phone, password, role = 'patient', city = 'Hyderabad' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isUsingMongo()) {
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password, // Pre-hook in Mongoose will hash or we pass raw
        role,
        city
      });
      return { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, city: user.city };
    }

    const store = getStore();
    const newUser = {
      _id: generateId('user'),
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role,
      city,
      createdAt: new Date().toISOString()
    };
    store.users.push(newUser);
    saveLocalStore();
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  async comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  // HOSPITAL OPERATIONS
  async getHospitals({ city, department, search } = {}) {
    if (isUsingMongo()) {
      let query = {};
      if (city && city !== 'All') query.city = new RegExp(`^${city}$`, 'i');
      if (department && department !== 'All') query.departments = department;
      if (search) query.name = new RegExp(search, 'i');
      return await Hospital.find(query);
    }

    const store = getStore();
    return store.hospitals.filter(h => {
      let match = true;
      if (city && city !== 'All') {
        match = match && h.city.toLowerCase() === city.toLowerCase();
      }
      if (department && department !== 'All') {
        match = match && h.departments.some(d => d.toLowerCase() === department.toLowerCase());
      }
      if (search) {
        match = match && (
          h.name.toLowerCase().includes(search.toLowerCase()) ||
          h.city.toLowerCase().includes(search.toLowerCase()) ||
          h.address.toLowerCase().includes(search.toLowerCase())
        );
      }
      return match;
    });
  },

  async getHospitalById(id) {
    if (isUsingMongo()) {
      return await Hospital.findOne({ id }) || await Hospital.findById(id);
    }
    const store = getStore();
    return store.hospitals.find(h => h.id === id || h._id === id) || null;
  },

  async getDepartmentsByHospitalId(id) {
    const hospital = await this.getHospitalById(id);
    if (!hospital) return [];
    return hospital.departments || [];
  },

  // DOCTOR OPERATIONS
  async getDoctors(hospitalId, department) {
    if (isUsingMongo()) {
      let query = {};
      if (hospitalId) query.hospitalId = hospitalId;
      if (department && department !== 'All') query.department = department;
      return await Doctor.find(query);
    }

    const store = getStore();
    return store.doctors.filter(d => {
      let match = true;
      if (hospitalId) match = match && d.hospitalId === hospitalId;
      if (department && department !== 'All') match = match && d.department.toLowerCase() === department.toLowerCase();
      return match;
    });
  },

  async getDoctorById(id) {
    if (isUsingMongo()) {
      return await Doctor.findOne({ id }) || await Doctor.findById(id);
    }
    const store = getStore();
    return store.doctors.find(d => d.id === id || d._id === id) || null;
  },

  // APPOINTMENT & QUEUE OPERATIONS
  async createAppointment({ userId, userName, userPhone, hospitalId, doctorId, department, appointmentDate, timeSlot, reason }) {
    const hospital = await this.getHospitalById(hospitalId);
    const doctor = await this.getDoctorById(doctorId);

    if (!hospital || !doctor) {
      throw new Error('Invalid hospital or doctor selection');
    }

    const appointmentCode = generateApptCode(hospital.city);
    const tokenNumber = generateTokenNumber();
    const tokenLetter = tokenNumber.split('-')[0];
    const tokenDigits = parseInt(tokenNumber.split('-')[1], 10);
    const currentlyServingDigits = Math.max(1, tokenDigits - Math.floor(2 + Math.random() * 4));
    const currentlyServing = `${tokenLetter}-${String(currentlyServingDigits).padStart(2, '0')}`;
    const peopleAhead = tokenDigits - currentlyServingDigits;
    const avgConsultationMinutes = 10;
    const estimatedWaitMinutes = Math.max(5, peopleAhead * avgConsultationMinutes);

    const apptId = generateId('appt');
    const qId = generateId('queue');

    const appointmentData = {
      _id: apptId,
      appointmentCode,
      userId,
      userName: userName || 'Patient',
      userPhone: userPhone || '',
      hospitalId,
      hospitalName: hospital.name,
      doctorId,
      doctorName: doctor.name,
      department: department || doctor.department,
      appointmentDate,
      timeSlot,
      status: 'CONFIRMED',
      reason: reason || 'General Healthcare Consultation',
      queueId: qId,
      createdAt: new Date().toISOString()
    };

    let status = 'WAITING';
    if (peopleAhead <= 1) status = 'YOUR TURN';
    else if (peopleAhead <= 3) status = 'ALMOST YOUR TURN';

    const queueData = {
      _id: qId,
      appointmentId: apptId,
      hospitalId,
      doctorId,
      tokenNumber,
      currentlyServing,
      peopleAhead,
      avgConsultationMinutes,
      estimatedWaitMinutes,
      status,
      counterRoom: `Room ${100 + Math.floor(Math.random() * 15)} (OPD Wing)`,
      lastUpdated: new Date().toISOString()
    };

    const notificationData = {
      _id: generateId('notif'),
      userId,
      title: 'Appointment Booked Successfully',
      message: `Your appointment with ${doctor.name} at ${hospital.name} is confirmed for ${appointmentDate} at ${timeSlot}. Token: ${tokenNumber}`,
      type: 'APPOINTMENT_CONFIRMED',
      isRead: false,
      link: `/queue/${apptId}`,
      createdAt: new Date().toISOString()
    };

    if (isUsingMongo()) {
      const createdAppt = await Appointment.create(appointmentData);
      await Queue.create(queueData);
      await Notification.create(notificationData);
      return { appointment: createdAppt, queue: queueData };
    }

    const store = getStore();
    store.appointments.unshift(appointmentData);
    store.queues.unshift(queueData);
    store.notifications.unshift(notificationData);
    saveLocalStore();

    return { appointment: appointmentData, queue: queueData };
  },

  async getUserAppointments(userId) {
    if (isUsingMongo()) {
      return await Appointment.find({ userId }).sort({ createdAt: -1 });
    }
    const store = getStore();
    return store.appointments
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getAppointmentById(id) {
    if (isUsingMongo()) {
      return await Appointment.findById(id);
    }
    const store = getStore();
    return store.appointments.find(a => a._id === id || a.id === id || a.appointmentCode === id) || null;
  },

  async cancelAppointment(id, userId) {
    if (isUsingMongo()) {
      const appt = await Appointment.findOne({ _id: id, userId });
      if (!appt) return null;
      appt.status = 'CANCELLED';
      await appt.save();

      await Notification.create({
        userId,
        title: 'Appointment Cancelled',
        message: `Your appointment ${appt.appointmentCode} has been cancelled.`,
        type: 'APPOINTMENT_CANCELLED',
        isRead: false,
        createdAt: new Date().toISOString()
      });

      return appt;
    }

    const store = getStore();
    const appt = store.appointments.find(a => (a._id === id || a.id === id) && a.userId === userId);
    if (!appt) return null;
    appt.status = 'CANCELLED';

    store.notifications.unshift({
      _id: generateId('notif'),
      userId,
      title: 'Appointment Cancelled',
      message: `Your appointment ${appt.appointmentCode} has been cancelled.`,
      type: 'APPOINTMENT_CANCELLED',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    saveLocalStore();
    return appt;
  },

  async getQueueByAppointmentId(appointmentId) {
    if (isUsingMongo()) {
      let q = await Queue.findOne({ appointmentId });
      if (!q) {
        // Fallback create default queue if not exists
        const appt = await Appointment.findById(appointmentId);
        if (!appt) return null;
        q = await Queue.create({
          appointmentId,
          hospitalId: appt.hospitalId,
          doctorId: appt.doctorId,
          tokenNumber: 'A-15',
          currentlyServing: 'A-12',
          peopleAhead: 3,
          estimatedWaitMinutes: 25,
          avgConsultationMinutes: 10,
          status: 'WAITING',
          counterRoom: 'Room 204 (OPD Block A)'
        });
      }
      return q;
    }

    const store = getStore();
    let q = store.queues.find(queue => queue.appointmentId === appointmentId);
    if (!q) {
      const appt = store.appointments.find(a => a._id === appointmentId || a.id === appointmentId);
      if (!appt) return null;
      q = {
        _id: generateId('queue'),
        appointmentId,
        hospitalId: appt.hospitalId,
        doctorId: appt.doctorId,
        tokenNumber: 'A-15',
        currentlyServing: 'A-12',
        peopleAhead: 3,
        estimatedWaitMinutes: 25,
        avgConsultationMinutes: 10,
        status: 'WAITING',
        counterRoom: 'Room 204 (OPD Block A)',
        lastUpdated: new Date().toISOString()
      };
      store.queues.push(q);
      saveLocalStore();
    }
    return q;
  },

  async advanceQueueSimulation(appointmentId) {
    const queue = await this.getQueueByAppointmentId(appointmentId);
    if (!queue) return null;

    if (queue.peopleAhead > 0) {
      queue.peopleAhead -= 1;
      const tokenLetter = queue.tokenNumber.split('-')[0];
      const tokenDigits = parseInt(queue.tokenNumber.split('-')[1], 10);
      const newServingDigits = tokenDigits - queue.peopleAhead;
      queue.currentlyServing = `${tokenLetter}-${String(newServingDigits).padStart(2, '0')}`;
      queue.estimatedWaitMinutes = Math.max(0, queue.peopleAhead * queue.avgConsultationMinutes);

      if (queue.peopleAhead === 0) {
        queue.status = 'YOUR TURN';
      } else if (queue.peopleAhead <= 2) {
        queue.status = 'ALMOST YOUR TURN';
      } else {
        queue.status = 'WAITING';
      }
    } else {
      queue.status = 'COMPLETED';
    }

    queue.lastUpdated = new Date().toISOString();

    if (isUsingMongo()) {
      await Queue.findOneAndUpdate({ appointmentId }, queue, { new: true });
    } else {
      saveLocalStore();
    }

    return queue;
  },

  async getUserNotifications(userId) {
    if (isUsingMongo()) {
      return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(15);
    }
    const store = getStore();
    return store.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 15);
  },

  async markNotificationAsRead(id) {
    if (isUsingMongo()) {
      return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    }
    const store = getStore();
    const notif = store.notifications.find(n => n._id === id || n.id === id);
    if (notif) {
      notif.isRead = true;
      saveLocalStore();
    }
    return notif;
  },

  async getStatsSummary() {
    const store = getStore();
    return {
      hospitalsCount: store.hospitals.length || 12,
      doctorsCount: store.doctors.length || 20,
      citiesCovered: 4,
      avgWaitReductionPercent: 42,
      activeQueuesTracked: 184
    };
  }
};

module.exports = dbService;
