import { prisma } from "../src/db";

async function main() {
  await prisma.workOrder.deleteMany();
  await prisma.customer.deleteMany();

  const acme = await prisma.customer.create({
    data: { name: "Acme Music", email: "shop@acme.test" },
  });
  const riley = await prisma.customer.create({
    data: { name: "Riley Chen", email: "riley@example.test" },
  });

  await prisma.workOrder.createMany({
    data: [
      { customerId: acme.id, jobType: "repair", formData: { issue: "Buzzing on 5th fret", urgency: "normal" } },
      { customerId: riley.id, jobType: "setup", status: "IN_PROGRESS", formData: { instrument: "Bass" } },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());