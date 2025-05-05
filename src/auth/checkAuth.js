"use strict";

const { findById } = require("../services/apiKey.service");



const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

// Middleware to check if the request has a valid API key
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString(); // Get the api key from the request header

    if (!key) {
      return res.status(401).json({
        status: false,
        message: "API key is missing",
      });
    }

    const apiKey = await findById(key); // Find the api key in the database
    if (!apiKey) {
      return res.status(401).json({
        status: false,
        message: "Invalid API key",
      });
    }

    req.objKey = objKey; // Set the api key in the request object
    return next(); // Call the next middleware
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Middleware to check if the user has the required permissions
const checkPermissions = (permissions) => {
  return (req, res, next) => {
    const userPermissions = req.objKey.permissions; // Get the permissions from the request object

    if (!userPermissions || !Array.isArray(userPermissions)) {
      return res.status(403).json({
        status: false,
        message: "Permissions not found",
      });
    }

    const hasPermission = permissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        status: false,
        message: "Permissions denied",
      });
    }

    return next(); // Call the next middleware
  };
};

module.exports = {
  apiKey,
  checkPermissions
};
