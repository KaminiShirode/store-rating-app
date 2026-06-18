const prisma = require("../config/prisma");
const { hashPassword, comparePassword, generateToken } = require("../utils/auth");
const {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} = require("../utils/validation");

async function signup({ name, email, password, address }) {
  const errors = [
    validateName(name),
    validateEmail(email),
    validatePassword(password),
    validateAddress(address),
  ].filter(Boolean);

  if (errors.length > 0) {
    throw { status: 400, message: errors.join(", ") };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw { status: 409, message: "Email already registered" };
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, address, role: "USER" },
  });

  const token = generateToken(user);
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = generateToken(user);
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) {
    throw { status: 401, message: "Current password is incorrect" };
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    throw { status: 400, message: passwordError };
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return { message: "Password updated successfully" };
}

module.exports = { signup, login, changePassword };