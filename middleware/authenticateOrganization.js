const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authOrganization = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.ORG_JWT_SECRET);
    req.organization = { name: payload.name, orgId: payload.orgId };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

module.exports = authOrganization;
