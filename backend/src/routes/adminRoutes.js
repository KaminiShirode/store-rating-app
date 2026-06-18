const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", adminController.getDashboardStats);
router.post("/users", adminController.createUser);
router.post("/stores", adminController.createStore);
router.get("/users", adminController.listUsers);
router.get("/stores", adminController.listStores);
router.get("/users/:id", adminController.getUserDetails);

module.exports = router;