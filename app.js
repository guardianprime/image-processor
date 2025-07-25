const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
