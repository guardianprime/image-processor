const express = require("express");
require("dotenv").config();
const { connectToMongoDB } = require("./db");
const bodyparser = require("body-parser");

const app = express();
connectToMongoDB();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
