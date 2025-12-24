import { Router } from "express";
import multer from "multer";

const upload = multer({ dest: "data/" });

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
