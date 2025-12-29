import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export const uploadImageController = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: req.file,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const transformImageController = async (req, res) => {
  try {
    const { id } = req.params;

    const { transformations } = req.body;

    const imagePath = path.join(process.cwd(), "data", id);

    try {
      await fs.access(imagePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const imageBuffer = await fs.readFile(imagePath);

    let image = sharp(imageBuffer);

    if (
      transformations.resize &&
      transformations.resize.width &&
      transformations.resize.height
    ) {
      image = image.resize(
        parseInt(transformations.resize.width),
        parseInt(transformations.resize.height)
      );
    }

    if (transformations.crop) {
      const { width, height, x, y } = transformations.crop;
      if (width && height && x !== undefined && y !== undefined) {
        image = image.extract({
          left: parseInt(x),
          top: parseInt(y),
          width: parseInt(width),
          height: parseInt(height),
        });
      }
    }

    if (transformations.rotate) {
      image = image.rotate(parseInt(transformations.rotate));
    }

    if (transformations.filters) {
      if (
        transformations.filters.grayscale === true ||
        transformations.filters.grayscale === "true"
      ) {
        image = image.grayscale();
      }

      if (
        transformations.filters.sepia === true ||
        transformations.filters.sepia === "true"
      ) {
        image = image.tint({ r: 112, g: 66, b: 20 });
      }
    }

    const format = transformations.format || "jpeg";
    const quality = 80;

    switch (format.toLowerCase()) {
      case "jpeg":
      case "jpg":
        image = image.jpeg({ quality });
        break;
      case "png":
        image = image.png({ compressionLevel: 9 });
        break;
      case "webp":
        image = image.webp({ quality });
        break;
      default:
        image = image.jpeg({ quality });
    }

    const outputBuffer = await image.toBuffer();

    res.set("Content-Type", `image/${format}`);
    res.send(outputBuffer);
  } catch (error) {
    console.error("Image transformation error:", error);
    res.status(500).json({
      success: false,
      error: "Image transformation failed",
      details: error.message,
    });
  }
};

export const getImageController = (req, res) => {};
export const getImagesController = (req, res) => {};
