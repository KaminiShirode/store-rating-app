const authService = require("../services/authService");

async function signup(req, res) {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

async function changePassword(req, res) {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

module.exports = { signup, login, changePassword };