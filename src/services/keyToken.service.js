'use strict'

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString,
            })

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.error("Error in createKeyToken:", error);
            throw new Error("Failed to create key token");
            
        }
    }

}

module.exports = KeyTokenService