import mongoose from "mongoose";
import { MONGO_URI } from "./config/env.js";

const CONNECTION_URL = MONGO_URI;

function connectToMongoDB() {
  mongoose.connect(CONNECTION_URL);

  mongoose.connection.on("connected", () => {
    console.log("successfuly connected to mongodb");
  });

  mongoose.connection.on("error", () => {
    console.log("failed to connect to mongodb");
  });
}

export default connectToMongoDB;
