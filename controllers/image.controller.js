export const uploadImageController = (req, res) => {
  console.log("This is the Request file", req.file);
  res.status(201).json({
    success: true,
    data: req.file,
  });
};

export const transformImageController = (req, res) => {};
export const getImageController = (req, res) => {};
export const getImagesController = (req, res) => {};
