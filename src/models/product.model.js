"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// define the product type = clothing
const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: "Clothes",
  }
);

// define the product type = electronic
const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);

// define the product type = furniture
const furnitureSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Furnitures",
  }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronic", electronicSchema),
  furniture: model("Furniture", furnitureSchema),
};
