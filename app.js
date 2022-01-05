require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connectdb');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const authenticateAdminMiddleware = require('./middleware/authenticateAdmin');
const authRoute = require('./routes/auth');
const companyRoute = require('./routes/company');

app.use(express.json());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/company', authenticateAdminMiddleware, companyRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
