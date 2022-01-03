const mongoose = require('mongoose');

const connectDB = async (URI) => {
  await mongoose.connect(URI);
};

module.exports = connectDB;
