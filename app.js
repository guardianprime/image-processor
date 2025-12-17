import express from "express";
import cookieParser from "cookie-parser";
import imageRouter from "./routes/images.routes.js";
import authRouter from "./routes/auth.routes.js";
import { PORT } from "./config/env.js";
import connectToMongoDB from "./db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = PORT || 3000;

app.get("/", (req, res) => {
  res.send("welcome to the image processor api");
});

app.use("/api/v1/images", imageRouter);
app.use("/api/v1/auth", authRouter);

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await connectToMongoDB();
});
