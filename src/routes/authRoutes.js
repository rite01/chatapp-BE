import { Router } from "express";
import multer from "multer";
import { loginUser, registerUser } from "../controller/authController.js";

const router = Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/create", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);

export default router;
