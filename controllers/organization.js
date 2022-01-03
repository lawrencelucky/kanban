const { StatusCodes } = require('http-status-codes');

const Organization = require('../models/Organization');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const registerOrganization = async (req, res) => {
  const { email, password, name, description } = req.body;

  const organizationAlreadyExists = await Organization.findOne({ email });

  if (organizationAlreadyExists) {
    throw new BadRequestError(
      'An organization with the email address already exist.'
    );
  }

  const organization = await Organization.create({
    email,
    password,
    name,
    description,
  });

  const token = organization.createJWT();

  res.status(StatusCodes.CREATED).json({
    success: true,
    organization: {
      id: organization._id,
      name: organization.name,
      email: organization.email,
      role: organization.role,
    },
    token,
  });
};

const loginToOrganization = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const organization = await Organization.findOne({ email });

  if (!organization) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await organization.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const token = organization.createJWT();

  res.status(StatusCodes.OK).json({
    success: true,
    organization: {
      name: organization.name,
      email: organization.email,
      id: organization._id,
    },
    token,
  });
};

module.exports = { loginToOrganization, registerOrganization };
