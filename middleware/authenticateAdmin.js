const jwt = require('jsonwebtoken');

const { UnauthenticatedError } = require('../errors');

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Invalid token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.admin = {
      adminId: payload.adminId,
      email: payload.email,
      username: payload.username,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid token');
  }
};

module.exports = authenticateAdmin;
