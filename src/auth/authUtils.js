'use strict'

const jwt = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // Add userId as subject in JWT payload
        const tokenPayload = {
            ...payload,
            sub: payload.userId.toString() // Convert ObjectId to string for JWT subject
        }

        // access token
        const accessToken = jwt.sign(tokenPayload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            audience: 'api.example.com',
            issuer: 'example.com'
        })

        // refresh token
        const refreshToken = jwt.sign(tokenPayload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '30d',
            audience: 'api.example.com',
            issuer: 'example.com'
        })

        // verify the tokens
        jwt.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error(`Error verifying access token::`, err)
            } else {
                console.log(`Access token verified successfully::`, decoded)
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        console.error('Error creating token pair::', error)
        throw new Error('Failed to create token pair')
    }
}

module.exports = {
    createTokenPair
}