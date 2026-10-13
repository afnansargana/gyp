const mongoose = require("mongoose");

const dbURI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/AutoFixHub";

mongoose
  .connect(dbURI)
  .then(() => {
    console.log(`Mongoose connected to ${dbURI}`);
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err.message);
    console.error(
      "Tip: Start MongoDB (Admin PowerShell: Start-Service MongoDB) or start Docker Desktop and run: docker run -d -p 27017:27017 --name autofix-mongo mongo:6"
    );
  });

const db = mongoose.connection;

db.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("Mongoose connection closed through app termination");
  } finally {
    process.exit(0);
  }
});

module.exports = db;
