const userService = require("../services/userService");

async function listStores(req, res) {
  try {
    const result = await userService.listStores(req.user.id, req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

async function submitRating(req, res) {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const { rating } = req.body;
    const result = await userService.submitRating(req.user.id, storeId, rating);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

module.exports = { listStores, submitRating };