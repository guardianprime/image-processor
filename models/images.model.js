import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  originalFileName: String,
  storedPath: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  width: Number,
  height: Number,
  format: String,
  uploadDate: { type: Date, default: Date.now },
  // Transformations
  crop: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
  },
  rotate: Number, // degrees
  watermark: {
    text: String,
    position: String, // e.g., 'top-left', 'bottom-right'
  },
  flip: Boolean,
  mirror: Boolean,
  compress: {
    quality: Number, // 0-100
  },
  changeFormat: String, // e.g., 'jpeg', 'png'
  filters: [String], // e.g., ['grayscale', 'sepia']
});

module.exports = mongoose.model("Image", ImageSchema);
