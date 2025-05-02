"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

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
    console.log(`Public Key Object::`, publicKeyObject.export({ type: "spki", format: "pem" }));

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
        shop: getInfoData({ fields: ["_id", "name", "email"], object: newShop }),
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
    try {
      // Input validation
      if (!name || !email || !password) {
        return {
          status: 400,
          message: "Missing required fields",
        };
      }

      // Step 1: Check for existing shop
      const existingShop = await shopModel.findOne({ email }).lean();
      if (existingShop) {
        return {
          status: 409,
          message: "Shop already exists",
          data: existingShop,
        };
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
        return {
          status: 500,
          message: "Failed to create shop",
          metadata: null,
        };
      }

      // Step 3: Generate keypair for authentication
      const { privateKey, publicKey } = this.generateKeyPair();

      // Step 4: Create tokens and store keys
      return await this.createTokensAndKeys(newShop, publicKey, privateKey);

    } catch (error) {
      console.error('SignUp Error::', error);
      return {
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      };
    }
  }
}

module.exports = AccessService;
