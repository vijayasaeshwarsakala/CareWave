const express = require('express');
const router = express.Router();
const {
  getHospitals,
  getHospitalById,
  getDepartments,
  getDoctors,
  getDoctorById
} = require('../controllers/hospitalController');

router.get('/', getHospitals);
router.get('/:id', getHospitalById);
router.get('/:id/departments', getDepartments);
router.get('/:id/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);

module.exports = router;
