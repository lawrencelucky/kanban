const { StatusCodes } = require('http-status-codes');

const Auth = require('../models/Auth');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const { email, username, password } = req.body;

  const emailAlreadyExist = await Auth.findOne({
    email,
  });

  if (emailAlreadyExist) {
    throw new BadRequestError('A user with the email address already exist.');
  }

  const admin = await Auth.create({
    email,
    username,
    password,
  });

  const token = admin.createJWT();

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: {
      id: admin._id,
      email: admin.email,
      username: admin.username,
      role: admin.role,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const admin = await Auth.findOne({ email });

  if (!admin) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await admin.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const token = admin.createJWT();

  res.status(StatusCodes.OK).json({
    success: true,
    user: {
      email: admin.email,
      username: admin.username,
      id: admin._id,
    },
    token,
  });
};

module.exports = { register, login };
