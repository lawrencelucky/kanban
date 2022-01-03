const { StatusCodes } = require('http-status-codes');

const Organization = require('../models/Organization');
const { BadRequestError } = require('../errors');

const addUserToOrganization = async (req, res) => {
  const isOrgInDB = (await Organization.countDocuments({})) === 0;

  if (isOrgInDB) {
    await Organization.create({
      organization: req.organization.orgId,
    });
  }

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

  const orgInDB = await Organization.find({});
  const users = orgInDB[0].users;

  if (users.includes(user)) {
    throw new BadRequestError(
      `This user already exist in ${req.organization.name}, please try again with a different user`
    );
  }

  await Organization.findOneAndUpdate(
    { organization: req.organization.orgId },
    {
      $addToSet: { users: user },
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: `${user} has been added to ${req.organization.name}`,
  });
};

const removeUserFromOrganization = async (req, res) => {
  const { user } = req.body;

  const orgInDB = await Organization.find({});
  const users = orgInDB[0].users;

  if (!users.includes(user)) {
    throw new BadRequestError(
      `This user does not exist in ${req.organization.name}, please try again with a different user`
    );
  }

  await Organization.findOneAndUpdate(
    { organization: req.organization.orgId },
    {
      $pull: { users: user },
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `${user} has been removed from the organization`,
  });
};

module.exports = {
  addUserToOrganization,
  removeUserFromOrganization,
};
