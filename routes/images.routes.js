import { Router } from "express";

const imageRouter = Router();

imageRouter.get("/", (req, res) => {
  res.send("image endpoint working");
});

export default imageRouter;
