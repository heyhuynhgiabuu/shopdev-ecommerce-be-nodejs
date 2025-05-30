"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Key"; // Model name
const COLLECTION_NAME = "Keys"; // Collection name

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { collection: COLLECTION_NAME, timestamps: true }
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
