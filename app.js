import { express } from "express";
import imageRouter from "./routes/images.routes";
import authController from "./controllers/auth.controller";

const app = express();
connectToMongoDB();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("welcome to the image processor api");
});

app.use("/api/v1/images", imageRouter);
app.use("/api/v1/auth", authController);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
