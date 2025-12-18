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

imageRouter.post("/images", upload.single("test"), uploadImageController);

imageRouter.post("/images/:id/transform", transformImageController);

imageRouter.get("/images", getImagesController);

imageRouter.get("/images/:id", getImageController);

export default imageRouter;
