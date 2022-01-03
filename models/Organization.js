const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Types.ObjectId,
    ref: 'OrganizationAuth',
    required: [true, 'Please provide an organization'],
  },
  users: {
    type: [String],
  },
});

module.exports = mongoose.model('Organization', OrganizationSchema);
