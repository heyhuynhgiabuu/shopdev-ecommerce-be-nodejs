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
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return next(new BadRequestError("API key not found"));
    }

    const objKey = await findById(key);
    if (!objKey) {
      return next(new BadRequestError("API key not valid"));
    }

    req.objKey = objKey; // Fix: was using undefined objKey variable
    return next();
  } catch (error) {
    next(error); // Fix: use next(error) instead of returning new Error
  }
};

// Middleware to check if the user has the required permissions
const checkPermissions = (permission) => {
  return (req, res, next) => {
    if (!req.objKey || !req.objKey.permissions) {
      return next(new ForbiddenError("Permission denied"));
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return next(new ForbiddenError("Permission denied"));
    }

    return next();
  };
};



module.exports = {
  apiKey,
  checkPermissions,
};
