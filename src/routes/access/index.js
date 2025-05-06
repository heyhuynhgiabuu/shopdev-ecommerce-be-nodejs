"use strict";

const express = require("express");

const accessController = require("../../controllers/access.controller"); // Import the access controller
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router(); // Import the router from express

// login route
router.post("/shop/login", asyncHandler(accessController.login)); 

// signup route
router.post("/shop/signup", asyncHandler(accessController.signup));

module.exports = router; // Export the router
