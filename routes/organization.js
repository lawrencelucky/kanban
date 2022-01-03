const express = require('express');
const router = express.Router();

const {
  loginToOrganization,
  registerOrganization,
} = require('../controllers/organization');

router.route('/register').post(registerOrganization);
router.route('/login').post(loginToOrganization);

module.exports = router;
