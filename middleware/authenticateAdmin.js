const jwt = require('jsonwebtoken');

const Auth = require('../models/Auth');
const { UnauthenticatedError } = require('../errors');

const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Invalid token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.admin = await Auth.findById(payload.adminId);
    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid token');
  }
};

module.exports = authenticateAdmin;
