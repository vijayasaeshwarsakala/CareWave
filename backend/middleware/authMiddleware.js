const jwt = require('jsonwebtoken');
const dbService = require('../services/dbService');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'carewave_super_secret_jwt_key_2026_healthcare_token');
      
      const user = await dbService.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User associated with this token no longer exists'
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

module.exports = { protect };
