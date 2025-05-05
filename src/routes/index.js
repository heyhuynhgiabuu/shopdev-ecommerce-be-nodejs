'use strict'

const express = require('express');
const router = express.Router(); // Import the router from express
const { apiKey, checkPermissions } = require('../auth/checkAuth.js'); // Import the apiKey middleware from checkAuth.js

// check apiKey middleware
router.use(apiKey); // Use the apiKey middleware

// check permissions middleware
router.use(checkPermissions('0000')); // Use the checkPermissions middleware with '0000' permission
// Import routes from access folder
router.use('/v1/api', require('./access/index.js')); // Use access routes


module.exports = router; // Export the router