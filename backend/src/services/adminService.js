const prisma = require("../config/prisma");
const { hashPassword } = require("../utils/auth");
const {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} = require("../utils/validation");

async function getDashboardStats() {
  const [users, stores, ratings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  return { totalUsers: users, totalStores: stores, totalRatings: ratings };
}

async function createUser({ name, email, password, address, role }) {
  const errors = [
    validateName(name),
    validateEmail(email),
    validatePassword(password),
    validateAddress(address),
  ].filter(Boolean);

  if (errors.length > 0) {
    throw { status: 400, message: errors.join(", ") };
  }

  if (!["ADMIN", "USER", "OWNER"].includes(role)) {
    throw { status: 400, message: "Invalid role" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw { status: 409, message: "Email already registered" };
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, address, role },
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function createStore({ name, email, address, ownerEmail }) {
  const errors = [
    validateName(name),
    validateEmail(email),
    validateAddress(address),
  ].filter(Boolean);

  if (errors.length > 0) {
    throw { status: 400, message: errors.join(", ") };
  }

  const existingStore = await prisma.store.findUnique({ where: { email } });
  if (existingStore) {
    throw { status: 409, message: "Store email already registered" };
  }

  const owner = await prisma.user.findUnique({ where: { email: ownerEmail } });
  if (!owner) {
    throw { status: 404, message: "Owner not found. Create the owner user first." };
  }

  const ownsAlready = await prisma.store.findUnique({ where: { ownerId: owner.id } });
  if (ownsAlready) {
    throw { status: 409, message: "This user already owns a store" };
  }

  if (owner.role !== "OWNER") {
    await prisma.user.update({
      where: { id: owner.id },
      data: { role: "OWNER" },
    });
  }

  const store = await prisma.store.create({
    data: { name, email, address, ownerId: owner.id },
  });

  return store;
}

async function listUsers(query) {
  const { name, email, address, role, sortBy, order } = query;

  const where = {};
  if (name) where.name = { contains: name, mode: "insensitive" };
  if (email) where.email = { contains: email, mode: "insensitive" };
  if (address) where.address = { contains: address, mode: "insensitive" };
  if (role) where.role = role;

  const allowedSort = ["name", "email", "address", "role"];
  const sortField = allowedSort.includes(sortBy) ? sortBy : "name";
  const sortOrder = order === "desc" ? "desc" : "asc";

  const users = await prisma.user.findMany({
    where,
    orderBy: { [sortField]: sortOrder },
    select: { id: true, name: true, email: true, address: true, role: true },
  });

  return users;
}

async function listStores(query) {
  const { name, email, address, sortBy, order } = query;

  const where = {};
  if (name) where.name = { contains: name, mode: "insensitive" };
  if (email) where.email = { contains: email, mode: "insensitive" };
  if (address) where.address = { contains: address, mode: "insensitive" };

  const allowedSort = ["name", "email", "address"];
  const sortField = allowedSort.includes(sortBy) ? sortBy : "name";
  const sortOrder = order === "desc" ? "desc" : "asc";

  const stores = await prisma.store.findMany({
    where,
    orderBy: { [sortField]: sortOrder },
    include: { ratings: true },
  });

  const result = stores.map((s) => {
    const avg =
      s.ratings.length > 0
        ? s.ratings.reduce((sum, r) => sum + r.rating, 0) / s.ratings.length
        : 0;
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      rating: Number(avg.toFixed(2)),
    };
  });

  return result;
}

async function getUserDetails(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, address: true, role: true },
  });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  let storeRating = null;
  if (user.role === "OWNER") {
    const store = await prisma.store.findUnique({
      where: { ownerId: userId },
      include: { ratings: true },
    });
    if (store) {
      const avg =
        store.ratings.length > 0
          ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
          : 0;
      storeRating = { storeName: store.name, rating: Number(avg.toFixed(2)) };
    }
  }

  return { ...user, storeRating };
}

module.exports = { getDashboardStats, createUser, createStore, listUsers, listStores, getUserDetails };
