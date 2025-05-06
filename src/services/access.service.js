"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  InternalServerError,
} = require("../core/error.response");

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
   * @param {Object} newShop - Newly created shop
   * @param {string} publicKey - Public key for token verification
   * @param {string} privateKey - Private key for token signing
   */
  static async createTokensAndKeys(newShop, publicKey, privateKey) {
    // Store public key in database
    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
    });

    if (!publicKeyString) {
      return {
        status: 500,
        message: "Failed to store public key",
      };
    }

    const publicKeyObject = crypto.createPublicKey(publicKeyString);

    // Generate authentication tokens
    const tokens = await createTokenPair(
      { userId: newShop._id, email: newShop.email },
      publicKeyObject,
      privateKey
    );

    return {
      status: 201,
      message: "Shop created successfully",
      data: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
    };
  }

  /**
   * Sign up a new shop
   * @param {Object} param0 - Shop details
   * @param {string} param0.name - Shop name
   * @param {string} param0.email - Shop email
   * @param {string} param0.password - Shop password
   */
  static async signUp({ name, email, password }) {
    a
    try {
      // Input validation
      if (!name || !email || !password) {
        throw new BadRequestError(
          "Missing required fields: name, email, password"
        );
      }

      // Step 1: Check for existing shop
      const existingShop = await shopModel.findOne({ email }).lean();
      if (existingShop) {
        throw new ConflictRequestError("Email already exists");
      }

      // Step 2: Create new shop
      const hashedPassword = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: hashedPassword,
        roles: [this.RoleShop.SHOP],
      });

      if (!newShop) {
        throw new ConflictRequestError("Failed to create shop");
      }

      // Step 3: Generate keypair for authentication
      const { privateKey, publicKey } = this.generateKeyPair();

      // Step 4: Create tokens and store keys
      return await this.createTokensAndKeys(newShop, publicKey, privateKey);
    } catch (error) {
      throw new InternalServerError(error.message || "Internal Server Error");
    }
  }
}

module.exports = AccessService;
