"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5 * 1000; // 5 seconds

// Check the number of connections to MongoDB
const countConnect = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of connections: ${numConnections}`);
};

// check overload connection
const checkOverloadConnection = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // example maximum number of connections based on CPU cores
    const maxConnections = numCores * 5; // 5 connections per core

    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnections > maxConnections) {
      console.warn(
        `Warning: Number of connections (${numConnections}) exceeds maximum (${maxConnections})`
      );
    } else {
      console.log(
        `Number of connections (${numConnections}) is within limits (${maxConnections})`
      );
    }
  }, _SECONDS); // check every 5 seconds
};

module.exports = { countConnect, checkOverloadConnection };
