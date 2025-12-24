import { Router } from "express";
import { upload } from "../middlewares/upload.middlwares.js";

import {
  uploadImageController,
  transformImageController,
  getImageController,
  getImagesController,
} from "../controllers/image.controller.js";

const imageRouter = Router();

imageRouter.post("/", upload.single("test"), uploadImageController);

imageRouter.post("/:id/transform", transformImageController);

imageRouter.get("/", getImagesController);

imageRouter.get("/:id", getImageController);

export default imageRouter;
