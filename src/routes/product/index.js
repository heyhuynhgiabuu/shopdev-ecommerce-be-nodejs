"use strict";

const express = require("express");

const productController = require("../../controllers/product.controller"); // Import the access controller
const { asyncHandler } = require("../../helpers/asyncHandler"); // Import the async handler
const { authentication } = require("../../auth/authUtils");
const router = express.Router(); // Import the router from express

// authentication route
router.use(authentication);

// create product route
router.post("/", asyncHandler(productController.createProduct));


module.exports = router; // Export the router
