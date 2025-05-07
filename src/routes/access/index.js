"use strict";

const express = require("express");

const accessController = require("../../controllers/access.controller"); // Import the access controller
const { asyncHandler } = require("../../helpers/asyncHandler"); // Import the async handler
const { authentication } = require("../../auth/authUtils");
const router = express.Router(); // Import the router from express

// login route
router.post("/shop/login", asyncHandler(accessController.login));

// signup route
router.post("/shop/signup", asyncHandler(accessController.signup));

// authentication route
router.use(authentication);

// logout route
router.post("/shop/logout", asyncHandler(accessController.logout));

// refresh token route
router.post("/shop/refresh-token", asyncHandler(accessController.refreshToken));

module.exports = router; // Export the router
