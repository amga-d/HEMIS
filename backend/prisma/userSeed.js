const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database users seed...");

  // clear existing records to avoid foregin key constraints
  await prisma.user.deleteMany({});

  const adminPassword = "admin"; // Change as needed
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const user = await prisma.user.create({
    data: {
      username: "admin",
      firstName: "John",
      lastName: "Smith",
      password: hashedPassword,
    },
  });

  console.log("✅ Created user: " + user.username);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
