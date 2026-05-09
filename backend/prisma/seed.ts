import prisma from "../src/prisma/client";
import { hashValue } from "../src/utils/hash.util";

const seed = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@expensepro.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const password = await hashValue(process.env.ADMIN_PASSWORD || "Admin@1234");
    await prisma.user.create({
      data: {
        name: "Administrator",
        email: adminEmail,
        password,
        role: "ADMIN",
      },
    });
    console.log("Seeded admin user: ", adminEmail);
  } else {
    console.log("Admin user already exists.");
  }

  await prisma.$disconnect();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
