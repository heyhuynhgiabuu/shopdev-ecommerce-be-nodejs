"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { OK } = require("../core/success.response");
const {
  BadRequestError,
  ConflictRequestError,
  InternalServerError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { StatusCodes } = require("../utils/statusCodes");

// Define roles as static class property for better encapsulation
class AccessService {
  static RoleShop = {
    SHOP: "001",
    WRITER: "002",
    EDITOR: "003",
    ADMIN: "004",
  };

  /**
   * Generate RSA key pair for authentication
   * @returns {Object} Object containing public and private keys
   */
  static generateKeyPair() {
    return crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
  }

  /**
   * Create tokens and handle key storage
   * @param {Object} shop - Shop object
   * @param {string} publicKey - Public key for token verification
   * @param {string} privateKey - Private key for token signing
   */
  static async createTokensAndKeys(shop, publicKey, privateKey) {
    try {
      // Generate tokens
      const tokens = await createTokenPair(
        { userId: shop._id, email: shop.email },
        publicKey,
        privateKey
      );

      // Store refresh token
      const keyStore = await KeyTokenService.createKeyToken({
        userId: shop._id,
        publicKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        throw new InternalServerError("Token creation failed");
      }

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new InternalServerError("Could not create tokens");
    }
  }

  /**
   * Log out a shop by removing its refresh token from the database
   * @param {Object} keyStore - KeyStore object
   * @returns {Object} - Success message
   */
  static async logOut(keyStore) {
    try {
      const delKey = await KeyTokenService.removeKeyById(keyStore.user);
      if (!delKey) {
        throw new InternalServerError("Logout failed");
      }
      return delKey;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log in an existing shop
   * @param {Object} param0 - Shop credentials
   * @param {string} param0.email - Shop email
   * @param {string} param0.password - Shop password
   */
  static async logIn({ email, password }) {
    try {
      // Validate input
      if (!email || !password) {
        throw new BadRequestError("Email and password are required");
      }

      // Find shop by email
      const shop = await findByEmail({ email });
      if (!shop) {
        throw new BadRequestError("Shop not registered");
      }

      // Check password
      const match = await bcrypt.compare(password, shop.password);
      if (!match) {
        throw new UnauthorizedError("Authentication failed");
      }

      // Generate new keypair
      const { privateKey, publicKey } = this.generateKeyPair();

      // Create tokens with consistent subject
      const tokens = await createTokenPair(
        { userId: shop._id, email: shop.email },
        publicKey,
        privateKey
      );

      // Store public key and refresh token
      await KeyTokenService.createKeyToken({
        userId: shop._id,
        publicKey: publicKey,
        refreshToken: tokens.refreshToken,
      });

      return {
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: shop,
          }),
          tokens,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sign up a new shop
   * @param {Object} param0 - Shop details
   * @param {string} param0.name - Shop name
   * @param {string} param0.email - Shop email
   * @param {string} param0.password - Shop password
   */
  static async signUp({ name, email, password }) {
    try {
      // Validate input
      if (!name || !email || !password) {
        throw new BadRequestError("Missing required fields");
      }

      // Check existing shop
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new ConflictRequestError("Shop already registered!");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: hashedPassword,
        roles: [this.RoleShop.SHOP],
      });

      if (!newShop) {
        throw new InternalServerError("Shop creation failed");
      }

      // Create keys and tokens
      const { privateKey, publicKey } = this.generateKeyPair();
      const tokens = await this.createTokensAndKeys(
        newShop,
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token
   */
  static async handlerRefreshToken(refreshToken) {
    try {
      // Check for refresh token
      if (!refreshToken) {
        throw new BadRequestError("Refresh token is required");
      }

      // Check if refresh token was used
      const foundToken = await KeyTokenService.findByRefreshTokensUsed(
        refreshToken
      );
      if (foundToken) {
        // Delete key and reject if token was already used
        await KeyTokenService.removeKeyById(foundToken.user);
        throw new ForbiddenError("Something wrong happened! Please relogin");
      }

      // Find current refresh token
      const holderToken = await KeyTokenService.findByRefreshToken(
        refreshToken
      );
      if (!holderToken) {
        throw new UnauthorizedError("Shop not registered");
      }

      // Verify refresh token
      const decoded = await verifyJWT(refreshToken, holderToken.publicKey);

      // Find shop
      const shop = await findByEmail({ email: decoded.email });
      if (!shop) {
        throw new NotFoundError("Shop not found");
      }

      // Create new token pair
      const { privateKey, publicKey } = AccessService.generateKeyPair();
      const tokens = await createTokenPair(
        { userId: shop._id, email: shop.email },
        publicKey,
        privateKey
      );

      // Update token store
      await KeyTokenService.createKeyToken({
        userId: shop._id,
        publicKey,
        refreshToken: tokens.refreshToken,
        refreshTokensUsed: [refreshToken], // Add old token to used list
      });

      return {
        code: StatusCodes.OK,
        metadata: {
          shop: getInfoData({ fields: ["_id", "name", "email"], object: shop }),
          tokens,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AccessService;
