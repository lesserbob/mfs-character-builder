import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  await prisma.classLevel.deleteMany();
  await prisma.class.deleteMany();

  const warrior = await prisma.class.create({
    data: {
      name: 'Warrior',
      classification: 'PATH',
      minMight: 2,
      minAgility: 0,
      minIntellect: 0,
      minSpirit: 0,
    },
  });

  await prisma.classLevel.createMany({
    data: [
      { classId: warrior.id, level: 1, health: 10, statBonus: 1 },
      { classId: warrior.id, level: 2, health: 5, statBonus: 1 },
      { classId: warrior.id, level: 3, health: 5, statBonus: 1 },
    ],
  });

  const mage = await prisma.class.create({
    data: {
      name: 'Mage',
      classification: 'PATH',
      minMight: 0,
      minAgility: 0,
      minIntellect: 2,
      minSpirit: 0,
    },
  });

  await prisma.classLevel.createMany({
    data: [
      { classId: mage.id, level: 1, health: 6, statBonus: 1 },
      { classId: mage.id, level: 2, health: 3, statBonus: 1 },
      { classId: mage.id, level: 3, health: 3, statBonus: 1 },
    ],
  });

  const human = await prisma.class.create({
    data: {
      name: 'Human',
      classification: 'RACE',
    },
  });

  await prisma.classLevel.create({
    data: {
      classId: human.id,
      level: 1,
      health: 5,
      statBonus: 1,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
