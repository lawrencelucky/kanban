const express = require('express');
const router = express.Router();

const authOrganizationMiddleware = require('../middleware/authenticateOrganization');
const {
  addUserToOrganization,
  removeUserFromOrganization,
} = require('../controllers/organization');

router
  .route('/addUser')
  .post(authOrganizationMiddleware, addUserToOrganization);
router
  .route('/removeUser')
  .post(authOrganizationMiddleware, removeUserFromOrganization);

module.exports = router;
