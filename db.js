const mongoose = require("mongoose");
require("dotenv").config();

const CONNECTION_URL = process.env.MONGO_URI;

function connectToMongoDB() {
  mongoose.connect(CONNECTION_URL);

  mongoose.connection.on("connected", () => {
    console.log("successfuly connected to mongodb");
  });

  mongoose.connection.on("error", () => {
    console.log("failed to connect to mongodb");
  });
}

module.exports = { connectToMongoDB };
