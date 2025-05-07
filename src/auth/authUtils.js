"use strict";

const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // Add userId as subject in JWT payload
    const tokenPayload = {
      ...payload,
      sub: payload.userId.toString(), // Convert ObjectId to string for JWT subject
    };

    // access token
    const accessToken = jwt.sign(tokenPayload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      audience: "api.example.com",
      issuer: "example.com",
    });

    // refresh token
    const refreshToken = jwt.sign(tokenPayload, privateKey, {
      algorithm: "RS256",
      expiresIn: "30d",
      audience: "api.example.com",
      issuer: "example.com",
    });

    // verify the tokens
    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error(`Error verifying access token::`, err);
      } else {
        console.log(`Access token verified successfully::`, decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error creating token pair::", error);
    throw new Error("Failed to create token pair");
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  try {
    // 1. Get userId from header
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
      throw new UnauthorizedError("Missing client id");
    }

    // 2. Get access token
    const rawToken = req.headers[HEADER.AUTHORIZATION];
    if (!rawToken) {
      throw new UnauthorizedError("Missing access token");
    }

    // Extract token removing 'Bearer ' prefix
    const accessToken = rawToken.replace("Bearer ", "").trim();
    if (!accessToken) {
      throw new UnauthorizedError("Invalid token format");
    }

    // 3. Get keyStore
    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) {
      throw new NotFoundError("Key store not found");
    }

    try {
      // 4. Verify token with public key from keyStore
      const decoded = jwt.verify(accessToken, keyStore.publicKey, {
        algorithms: ["RS256"],
      });

      // 5. Validate token payload
      if (decoded.userId !== userId) {
        throw new UnauthorizedError("Invalid token payload");
      }

      // 6. Attach verified data to request
      req.keyStore = keyStore;
      req.user = decoded;
      req.userId = userId;

      return next();
    } catch (error) {
      throw new UnauthorizedError(
        `Token verification failed: ${error.message}`
      );
    }
  } catch (error) {
    next(error);
  }
});

const verifyJWT = async (token, publicKey) => {
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });
    return decoded;
  } catch (error) {
    throw new UnauthorizedError(`Token verification failed: ${error.message}`);
  }
}


module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
