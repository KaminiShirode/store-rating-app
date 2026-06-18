const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate, authorize("USER"));

router.get("/stores", userController.listStores);
router.post("/stores/:storeId/rating", userController.submitRating);

module.exports = router;