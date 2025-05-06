"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, refreshToken }) {
    try {
      // Convert publicKey to string if it isn't already
      const publicKeyString = publicKey.toString();

      const filter = { user: userId };
      const update = {
        publicKey: publicKeyString,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      if (!tokens) {
        throw new Error("Token creation failed");
      }

      return tokens;
    } catch (error) {
      throw new Error(`Create KeyToken error: ${error.message}`);
    }
  }
}

module.exports = KeyTokenService;
