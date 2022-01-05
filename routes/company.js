const express = require('express');
const router = express.Router();

const {
  createCompany,
  getAllCompany,
  addUserToCompany,
  removeUserFromCompany,
} = require('../controllers/company');

router.route('/').post(createCompany).get(getAllCompany);
router.route('/addUser/:id').patch(addUserToCompany);
router.route('/removeUser/:id').patch(removeUserFromCompany);

module.exports = router;
