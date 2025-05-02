const app = require("./src/app");

const PORT = process.env.DEV_APP_PORT || 3010;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  // Close any open connections, clean up resources, etc.
  // For example, if you're using Mongoose, you can close the connection like this:
  await mongoose.connection.close();
  process.exit(0);
});
