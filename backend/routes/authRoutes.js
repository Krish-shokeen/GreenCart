const express = require("express");
const { signup, login, updateProfile } = require("../controllers/authController");

const router = express.Router();
const upload = require("../multer");
const authMiddleware = require("../middleware/authMiddleware");

// Single image upload
router.post("/upload-profile-pic", upload.single("profilePic"), async (req, res) => {
  try {
    console.log("Received file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file received" });
    }

    return res.json({
      message: "Uploaded",
      url: req.file.path,
    });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    return res.status(500).json({ message: "Upload error", error: err.message });
  }
});

// Multiple images upload for products
router.post("/upload-images", upload.array("images", 5), async (req, res) => {
  try {
    console.log("Received files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files received" });
    }

    const urls = req.files.map(file => file.path);

    return res.json({
      message: "Uploaded",
      urls: urls,
    });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    return res.status(500).json({ message: "Upload error", error: err.message });
  }
});

router.post("/signup", signup);
router.post("/login", login);
router.put("/update-profile", authMiddleware, updateProfile);

module.exports = router;
