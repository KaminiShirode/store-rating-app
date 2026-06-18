const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

module.exports = { hashPassword, comparePassword, generateToken };