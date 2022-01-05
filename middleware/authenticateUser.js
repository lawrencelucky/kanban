const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authOrganization = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.USER_JWT_SECRET);
    req.user = {
      email: payload.email,
      userId: payload.userId,
      orgId: payload.orgId,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

module.exports = authOrganization;
