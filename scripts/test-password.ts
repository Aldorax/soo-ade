import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = "admin123"; // The password you used when creating the admin

  try {
    console.log(`Looking up user with email: ${email}`);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("User found:", {
      id: user.id,
      email: user.email,
      hashedPassword: user.password,
    });

    const isPasswordValid = await compare(password, user.password);
    console.log(`Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log("Password comparison failed. This could be due to:");
      console.log("1. The password you're trying is incorrect");
      console.log(
        "2. The hashing algorithm used during creation is different from the one used for comparison"
      );
    }
  } catch (error) {
    console.error("Error testing password:", error);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
