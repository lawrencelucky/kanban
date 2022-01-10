const { StatusCodes } = require('http-status-codes');

const Company = require('../models/Company');
const { BadRequestError, NotFoundError } = require('../errors');

const createCompany = async (req, res) => {
  req.body.createdBy = req.admin._id;
  const { company } = req.body;

  const companyAlreadyExist = await Company.findOne({ company });

  if (companyAlreadyExist) {
    throw new BadRequestError('A company with this name already exists');
  }

  console.log(req.body);

  const newCompany = await Company.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    company: newCompany,
  });
};

const getAllCompany = async (req, res) => {
  const adminId = req.admin;
  console.log(adminId);
  const company = await Company.find({ createdBy: adminId });

  res.status(StatusCodes.OK).json({
    success: true,
    company,
  });
};

const addUserToCompany = async (req, res) => {
  const { user } = req.body;

  if (!user) {
    throw new BadRequestError('Please provide a user');
  }

  const isValid =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      user
    );

  if (!isValid) {
    throw new BadRequestError(
      'Please provide a valid email address for the user'
    );
  }

  const cmp = await Company.findById(req.params.id);
  const users = cmp.users;

  if (users.includes(user)) {
    throw new BadRequestError(
      `This user already exist in ${cmp.company}, please try again with a different user`
    );
  }

  await Company.findOneAndUpdate(
    { _id: req.params.id },
    {
      $addToSet: { users: user.toLowerCase() },
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: `${user} has been added to ${cmp.company}`,
  });
};

const removeUserFromCompany = async (req, res) => {
  const { user } = req.body;

  if (!user) {
    throw new BadRequestError('Please provide a user');
  }

  const isValid =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      user
    );

  if (!isValid) {
    throw new BadRequestError(
      'Please provide a valid email address for the user'
    );
  }

  const cmp = await Company.findById(req.params.id);

  if (!cmp) {
    throw new NotFoundError(
      `Company with the id ${req.params.id} does not exist`
    );
  }

  const users = cmp.users;

  if (!users.includes(user.toLowerCase())) {
    throw new BadRequestError(
      `This user does not exist in ${cmp.company}, please try again with a different user`
    );
  }

  await Company.findOneAndUpdate(
    { _id: req.params.id },
    {
      $pull: { users: user.toLowerCase() },
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `${user} has been removed from the company`,
  });
};

module.exports = {
  createCompany,
  getAllCompany,
  addUserToCompany,
  removeUserFromCompany,
};
