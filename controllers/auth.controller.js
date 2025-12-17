import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signUpController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await User.create({ username, password });

    res.status(201).json({
      success: true,
      data: {
        newUser,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
  } catch (error) {}
};
