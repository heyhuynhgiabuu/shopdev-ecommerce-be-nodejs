"use strict";

const {
  BadRequestError,
  InternalServerError,
  ForbiddenError,
} = require("../core/error.response");
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
      throw new BadRequestError("API key not found", 401);
    }

    const apiKey = await findById(key); // Find the api key in the database
    if (!apiKey) {
      throw new BadRequestError("API key not valid", 401);
    }

    req.objKey = objKey; // Set the api key in the request object
    return next(); // Call the next middleware
  } catch (error) {
    return new InternalServerError(error.message, 500); // Handle the error
  }
};

// Middleware to check if the user has the required permissions
const checkPermissions = (permissions) => {
  return (req, res, next) => {
    const userPermissions = req.objKey.permissions; // Get the permissions from the request object

    if (!userPermissions || !Array.isArray(userPermissions)) {
      return new ForbiddenError("Permissions denied");
    }

    const hasPermission = permissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return new ForbiddenError("Permission denied");
    }

    return next(); // Call the next middleware
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next); // Handle async errors
  };
};

module.exports = {
  apiKey,
  checkPermissions,
  asyncHandler,
};
