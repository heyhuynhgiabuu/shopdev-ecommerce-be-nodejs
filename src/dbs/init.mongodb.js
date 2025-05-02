"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../configs/config.mongodb.js"); // import config mongodb
const { countConnect } = require("../helpers/check.connect.js"); // import check connect helper
const { checkOverloadConnection } = require("../helpers/check.connect.js"); // import check overload connection helper

const connectString =
  process.env.MONGODB_URI || `mongodb://${host}:${port}/${name}`; // mongodb connection string

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    // dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 10, // max connection pool size
        minPoolSize: 1, // min connection pool size
        maxIdleTimeMS: 10000, // max idle time for connection
        waitQueueTimeoutMS: 5000, // max wait time for connection
      })
      .then(() => {
        // countConnect(); // check connection
        // checkOverloadConnection(); // check overload connection
        console.log("MongoDB connected");
      })
      .catch((err) => console.error("MongoDB connection error:", err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const db = Database.getInstance(); // get instance of Database class

module.exports = db; // export instance of Database class
