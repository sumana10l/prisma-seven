import { prisma } from "./lib/prisma";

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      username: "kiyan",
      password: "pass123",
      name: "kiyan person",
    },
  });

  console.log("User created:", user);

  // Create travel plans for this user
  const plans = await prisma.travelPlan.createMany({
    data: [
      {
        userId: user.id,
        title: "Goa Trip",
        destinationCity: "Goa",
        destinationCountry: "India",
        startDate: new Date("2025-03-10"),
        endDate: new Date("2025-03-18"),
        budget: 20000,
      },
      {
        userId: user.id,
        title: "Bali Trip",
        destinationCity: "Bali",
        destinationCountry: "Indonesia",
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-06-12"),
        budget: 55000,
      },
    ],
  });

  console.log("Travel plans added:", plans);
}

main()
  .then(() => {
    console.log("Seeding completed ✔️");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Seeding failed", e);
    process.exit(1);
  });
