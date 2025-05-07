"use strict";

const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static async createKeyToken({
    userId,
    publicKey,
    refreshToken,
    refreshTokensUsed = [],
  }) {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        refreshTokensUsed,
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

  static async findByUserId(userId) {
    try {
      const keyStore = await keyTokenModel
        .findOne({
          user: new Types.ObjectId(userId),
        })
        .lean();

      if (!keyStore) {
        throw new NotFoundError("Key store not found");
      }

      return keyStore;
    } catch (error) {
      throw error;
    }
  }

  static async removeKeyById(userId) {
    try {
      const result = await keyTokenModel.deleteOne({
        user: new Types.ObjectId(userId),
      });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error(`Remove KeyToken failed: ${error.message}`);
    }
  }

  static async findByRefreshTokensUsed(refreshToken) {
    try {
      const keyStore = await keyTokenModel
        .findOne({
          refreshTokensUsed: refreshToken,
        })
        .lean();
      return keyStore;
    } catch (error) {
      throw new Error(
        `Find KeyToken by refresh token failed: ${error.message}`
      );
    }
  }

  static async findByRefreshToken(refreshToken) {
    try {
      const keyStore = await keyTokenModel.findOne({
        refreshToken,
      });
      return keyStore;
    } catch (error) {
      throw new Error(
        `Find KeyToken by refresh token failed: ${error.message}`
      );
    }
  }
}

module.exports = KeyTokenService;
