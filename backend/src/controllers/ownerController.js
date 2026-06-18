const ownerService = require("../services/ownerService");

async function getDashboard(req, res) {
  try {
    const result = await ownerService.getDashboard(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

module.exports = { getDashboard };