import { PrismaClient } from '@prisma/client';
import { seedClasses } from './seed-classes';
import { seedItems } from './seed-items';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding static data...');
  await seedClasses(prisma);
  await seedItems(prisma);

  console.log('Static data seeding finished.');
  console.log('Note: Dynamic data (creatures, etc.) was preserved.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
