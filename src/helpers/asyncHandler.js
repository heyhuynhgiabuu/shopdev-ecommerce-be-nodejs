"use strict";

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next); // Handle async errors
  };
};

module.exports = {
  asyncHandler,
};
