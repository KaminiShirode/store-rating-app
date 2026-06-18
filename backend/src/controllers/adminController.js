const adminService = require("../services/adminService");

async function getDashboardStats(req, res) {
  try {
    const result = await adminService.getDashboardStats();
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

async function createUser(req, res) {
  try {
    const result = await adminService.createUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

async function createStore(req, res) {
  try {
    const result = await adminService.createStore(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

async function listUsers(req, res) {
  try {
    const result = await adminService.listUsers(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

async function listStores(req, res) {
  try {
    const result = await adminService.listStores(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

async function getUserDetails(req, res) {
  try {
    const result = await adminService.getUserDetails(parseInt(req.params.id, 10));
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
}

module.exports = { getDashboardStats, createUser, createStore, listUsers, listStores, getUserDetails };
