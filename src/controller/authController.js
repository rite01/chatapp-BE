import bcrypt from "bcrypt";
import Item from "../modal/user.js";
import { generateToken } from "../app.js";
import { v2 as cloudinary } from "cloudinary";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Item.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    let profilePicUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles",
      });
      profilePicUrl = result.secure_url;
    }

    const user = await Item.create({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePicUrl,
    });
    const token = generateToken(user._id);

    res.status(201).json({ message: "User created successfully", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Item.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    const userDetails = user.toObject();
    delete userDetails.password;

    res
      .status(200)
      .json({ message: "Login successful", token, user: userDetails });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
