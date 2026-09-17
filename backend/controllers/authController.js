const jwt = require('jsonwebtoken');
const dbService = require('../services/dbService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'carewave_super_secret_jwt_key_2026_healthcare_token', {
    expiresIn: '30d'
  });
};

// @desc    Register a new patient
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, city } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, phone, password)'
      });
    }

    const userExists = await dbService.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    const user = await dbService.createUser({
      name,
      email,
      phone,
      password,
      city: city || 'Hyderabad'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to CareWave.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: User not found'
      });
    }

    const isMatch = await dbService.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        token: generateToken(user._id || user.id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};

// @desc    Demo user 1-click login for presentations / testing
// @route   POST /api/auth/demo-login
// @access  Public
const demoLogin = async (req, res, next) => {
  try {
    const demoEmail = 'rahul.patient@carewave.in';
    let user = await dbService.findUserByEmail(demoEmail);

    if (!user) {
      user = await dbService.createUser({
        name: 'Rahul Sharma',
        email: demoEmail,
        phone: '+91 98765 43210',
        password: 'CareWave@123',
        city: 'Hyderabad'
      });
    }

    const userId = user._id || user.id;

    res.json({
      success: true,
      message: 'Demo account logged in successfully',
      data: {
        _id: userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        token: generateToken(userId)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  demoLogin
};
