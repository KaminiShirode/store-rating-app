const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.put("/change-password", authenticate, authController.changePassword);

module.exports = router;