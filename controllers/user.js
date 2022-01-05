const { StatusCodes } = require('http-status-codes');

const Organization = require('../models/Company');
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const registerUser = async (req, res) => {
  const organization = req.organization.orgId;
  const { email, password } = req.body;

  const orgDB = await Organization.find({});

  const users = orgDB[0].users;

  if (!users.includes(email)) {
    throw new BadRequestError(
      'Sorry, the provided email is not recognized in this organization, please contact the admin and try again or check your email address.'
    );
  }

  const userAlreadyExist = await User.findOne({ email });

  if (userAlreadyExist) {
    throw new BadRequestError(
      'A user with this email has been registered in this organization, please try again or check your email address'
    );
  }

  const user = await User.create({
    organization,
    email,
    password,
  });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      organization: user.organization,
    },
    token,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      organization: user.organization,
    },
    token,
  });
};

module.exports = {
  registerUser,
  loginUser,
};
