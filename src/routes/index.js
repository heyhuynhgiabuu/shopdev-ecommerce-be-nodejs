'use strict'

const express = require('express');
const router = express.Router(); // Import the router from express

// Import routes from access folder
router.use('/v1/api', require('./access/index.js')); // Use access routes
// router.get('', (req, res, next) => {
//     // const strCompression = 'Hello World!';
//   return res.status(200).json({
//     message: 'Welcome to the API',
//     // metadata: strCompression.repeat(100000), // 10000 times
//   });
// });


module.exports = router; // Export the router