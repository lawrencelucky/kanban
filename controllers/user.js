const { StatusCodes } = require('http-status-codes');

const Company = require('../models/Company');
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const registerUser = async (req, res) => {
  const { email, password, company, username } = req.body;

  if (!email || !password || !company || !username) {
    throw new BadRequestError(
      'Please provide email, username, password and company name.'
    );
  }

  const cmp = await Company.findOne({ company });

  const users = cmp.users;

  if (!users.includes(email)) {
    throw new BadRequestError(
      'Sorry, you have not been added to this company, contact the administrator to add your acccount.'
    );
  }

  const usersInDB = await User.find({ company });

  usersInDB.forEach((user) => {
    if (email === user.email) {
      throw new BadRequestError(
        'A user with this credentials already exist in the provided company'
      );
    }
  });

  const user = await User.create(req.body);

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      company: user.company,
    },
    token,
  });
};

const loginUser = async (req, res) => {
  const { email, password, company } = req.body;

  if (!email || !password || !company) {
    throw new BadRequestError(
      'Please provide email, password and company name'
    );
  }

  const user = await User.findOne({ email, company });

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
      username: user.username,
      company: user.company,
    },
    token,
  });
};

module.exports = {
  registerUser,
  loginUser,
};
