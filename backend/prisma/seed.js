require("dotenv/config");
const prisma = require("../src/config/prisma");
const { hashPassword } = require("../src/utils/auth");

async function main() {
  const email = "admin@example.com";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists.");
    return;
  }

  const hashed = await hashPassword("Admin@123");

  await prisma.user.create({
    data: {
      name: "System Administrator Master Account",
      email,
      password: hashed,
      address: "Head Office, Pune",
      role: "ADMIN",
    },
  });

  console.log("Admin created: admin@example.com / Admin@123");
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));