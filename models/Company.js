const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    unique: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'Auth',
    required: [true, 'Please add the owner of the organization'],
  },
  users: {
    type: [String],
  },
});

module.exports = mongoose.model('Company', CompanySchema);
