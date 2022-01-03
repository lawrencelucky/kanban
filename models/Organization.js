const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const OrganizationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email address',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name of organization'],
  },
  description: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    default: 'Admin',
  },
});

OrganizationSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

OrganizationSchema.methods.createJWT = function () {
  return jwt.sign(
    { email: this.email, orgId: this._id, name: this.name },
    process.env.ORG_JWT_SECRET,
    { expiresIn: process.env.ORG_JWT_EXPIRY }
  );
};

OrganizationSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('Organization', OrganizationSchema);
