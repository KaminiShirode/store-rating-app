const prisma = require("../config/prisma");

async function listStores(userId, query) {
  const { name, address, sortBy, order } = query;

  const where = {};
  if (name) where.name = { contains: name, mode: "insensitive" };
  if (address) where.address = { contains: address, mode: "insensitive" };

  const allowedSort = ["name", "address"];
  const sortField = allowedSort.includes(sortBy) ? sortBy : "name";
  const sortOrder = order === "desc" ? "desc" : "asc";

  const stores = await prisma.store.findMany({
    where,
    orderBy: { [sortField]: sortOrder },
    include: { ratings: true },
  });

  return stores.map((s) => {
    const avg =
      s.ratings.length > 0
        ? s.ratings.reduce((sum, r) => sum + r.rating, 0) / s.ratings.length
        : 0;
    const myRating = s.ratings.find((r) => r.userId === userId);
    return {
      id: s.id,
      name: s.name,
      address: s.address,
      overallRating: Number(avg.toFixed(2)),
      myRating: myRating ? myRating.rating : null,
    };
  });
}

async function submitRating(userId, storeId, rating) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw { status: 400, message: "Rating must be an integer between 1 and 5" };
  }

  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw { status: 404, message: "Store not found" };
  }

  const result = await prisma.rating.upsert({
    where: { userId_storeId: { userId, storeId } },
    update: { rating },
    create: { userId, storeId, rating },
  });

  return result;
}

module.exports = { listStores, submitRating };