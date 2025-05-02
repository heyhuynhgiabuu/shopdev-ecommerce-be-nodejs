"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  signup = async (req, res, next) => {
    try {
      console.log("Request body:", req.body); // Add logging to debug
      const result = await AccessService.signUp(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
