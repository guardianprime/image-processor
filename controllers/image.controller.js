import sharp from "sharp";
import fsPromises from "fs/promises";
import fs from "fs";
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
      await fsPromises.access(imagePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const imageBuffer = await fsPromises.readFile(imagePath);

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

export const getImageController = (req, res) => {
  try {
    const imageId = req.params.id;
    const imagePath = path.join(process.cwd(), "data", imageId);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const ext = path.extname(imageId).toLowerCase();
    const contentTypeMap = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".bmp": "image/bmp",
    };

    const contentType = contentTypeMap[ext] || "application/octet-stream";

    res.set("Content-Type", contentType);
    res.set("Cache-Control", "public, max-age=86400");

    const fileStream = fs.createReadStream(imagePath);

    fileStream.on("error", (error) => {
      console.error("File stream error:", error);
      res.status(500).json({
        success: false,
        message: "Error reading image file",
      });
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error("Get image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve image",
      details: error.message,
    });
  }
};

export const getImagesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page number must be greater than 0",
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100",
      });
    }

    const dataPath = path.join(process.cwd(), "data");

    try {
      fs.access(dataPath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Images directory not found",
      });
    }

    const allFiles = fs.readdir(dataPath);

    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
    ];
    const imageFiles = allFiles.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    const totalImages = imageFiles.length;
    const totalPages = Math.ceil(totalImages / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    if (page > totalPages && totalImages > 0) {
      return res.status(404).json({
        success: false,
        message: `Page ${page} not found. Total pages: ${totalPages}`,
      });
    }

    const paginatedImages = imageFiles.slice(startIndex, endIndex);

    const imagesWithDetails = await Promise.all(
      paginatedImages.map(async (filename) => {
        const filePath = path.join(dataPath, filename);
        const stats = fs.stat(filePath);

        return {
          id: filename,
          filename: filename,
          url: `/api/images/${filename}`,
          size: stats.size,
          sizeKB: (stats.size / 1024).toFixed(2),
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          extension: path.extname(filename),
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        images: imagesWithDetails,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalImages: totalImages,
          imagesPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          nextPage: page < totalPages ? page + 1 : null,
          previousPage: page > 1 ? page - 1 : null,
        },
      },
    });
  } catch (error) {
    console.error("Get images error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve images",
      details: error.message,
    });
  }
};
