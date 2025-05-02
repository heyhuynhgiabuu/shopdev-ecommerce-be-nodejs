"use strict";

const express = require("express");

const accessController = require("../../controllers/access.controller"); // Import the access controller
const router = express.Router(); // Import the router from express

// signup route
router.post("/shop/signup", accessController.signup);

module.exports = router; // Export the router
