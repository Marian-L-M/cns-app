// import { PrismaClient } from "@prisma/client";
// import { entries } from "../data/entries";
// const prisma = new PrismaClient();

// async function main() {
//   await prisma.user.create({
//     data: {
//       email: `testemail@gmail.com`,
//       role: "ADMIN",
//       password: "pumpers123",
//     },
//   });

//   await prisma.entry.createMany({
//     data: entries,
//   });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
