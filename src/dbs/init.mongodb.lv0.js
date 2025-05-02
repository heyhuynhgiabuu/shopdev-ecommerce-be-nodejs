"use strict";

const mongoose = require("mongoose");

const connectString =
  process.env.MONGODB_URI || "mongodb://localhost:27017/shopdev";
mongoose
  .connect(connectString)
  .then((_) => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// dev
if (1 === 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose.connection; // export connection to use in other files