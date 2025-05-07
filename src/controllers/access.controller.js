"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED } = require("../core/success.response");
const {
  UnauthorizedError,
  BadRequestError,
} = require("../core/error.response");

class AccessController {
  /**
   * Handles user login
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware function
   */
  login = async (req, res, next) => {
    try {
      console.log(`[P]::login::`, req.body);
      const { email, password } = req.body;

      // Login via service
      const result = await AccessService.logIn({ email, password });

      // Send response using success response class
      return new OK({
        message: "Login successful",
        metadata: result.metadata,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles user signup
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware function
   */
  signup = async (req, res, next) => {
    try {
      console.log(`[P]::signup::`, req.body);

      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        throw new BadRequestError("Missing required fields");
      }

      const result = await AccessService.signUp({ name, email, password });

      return new CREATED({
        message: "Create new shop success",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      console.error(`[E]::signup::`, error.message);
      next(error); // Pass error to middleware
    }
  };

  /**
   * Handles user logout
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware function
   */
  logout = async (req, res, next) => {
    try {
      const keyStore = req.keyStore;
      if (!keyStore) {
        throw new UnauthorizedError("Invalid request");
      }

      await AccessService.logOut(keyStore);

      return new OK({
        message: "Logout successful",
        metadata: null,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles user refresh token
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware function
   */
  refreshToken = async (req, res, next) => {
    try {
      // Get refresh token from request body
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new BadRequestError("Missing refresh token");
      }

      // Call the handler method for refresh token
      const result = await AccessService.handlerRefreshToken(refreshToken);

      return new OK({
        message: "Refresh token successful",
        metadata: result.metadata,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
