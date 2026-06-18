const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate, authorize("OWNER"));

router.get("/dashboard", ownerController.getDashboard);

module.exports = router;