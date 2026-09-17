const dbService = require('../services/dbService');

// @desc    Get all hospitals with optional city & department filters
// @route   GET /api/hospitals
// @access  Public
const getHospitals = async (req, res, next) => {
  try {
    const { city, department, search } = req.query;
    const hospitals = await dbService.getHospitals({ city, department, search });

    res.json({
      success: true,
      count: hospitals.length,
      disclaimer: 'Hospital information shown for demonstration purposes. CareWave is not affiliated with the hospitals listed unless explicitly stated.',
      data: hospitals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hospital by ID
// @route   GET /api/hospitals/:id
// @access  Public
const getHospitalById = async (req, res, next) => {
  try {
    const hospital = await dbService.getHospitalById(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    res.json({
      success: true,
      data: hospital
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get departments in a hospital
// @route   GET /api/hospitals/:id/departments
// @access  Public
const getDepartments = async (req, res, next) => {
  try {
    const departments = await dbService.getDepartmentsByHospitalId(req.params.id);
    res.json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctors in a hospital with optional department filter
// @route   GET /api/hospitals/:id/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { department } = req.query;
    const doctors = await dbService.getDoctors(req.params.id, department);

    res.json({
      success: true,
      count: doctors.length,
      disclaimer: 'All doctor profiles and availability are realistic demo data for demonstration purposes.',
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await dbService.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHospitals,
  getHospitalById,
  getDepartments,
  getDoctors,
  getDoctorById
};
