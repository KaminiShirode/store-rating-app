const prisma = require("../config/prisma");

async function getDashboard(ownerId) {
  const store = await prisma.store.findUnique({
    where: { ownerId },
    include: {
      ratings: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!store) {
    throw { status: 404, message: "No store found for this owner" };
  }

  const avg =
    store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : 0;

  const raters = store.ratings.map((r) => ({
    userId: r.user.id,
    name: r.user.name,
    email: r.user.email,
    rating: r.rating,
  }));

  return {
    store: { id: store.id, name: store.name },
    averageRating: Number(avg.toFixed(2)),
    raters,
  };
}

module.exports = { getDashboard };