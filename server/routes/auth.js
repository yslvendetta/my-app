import express from "express";
import multer from "multer";
import { register, login } from "../controllers/auth.js";

const router = express.Router();

// Setup storage for profile pictures
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets"); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // You can customize filename logic here
    },
});

const upload = multer({ storage });

// Modify the register route to handle picture uploads
router.post("/register", upload.single("picture"), register);
router.post("/login", login);

export default router;
