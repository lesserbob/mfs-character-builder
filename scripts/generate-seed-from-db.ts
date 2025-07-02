import {
  PrismaClient,
  ClassClassification,
  GearType,
  RateOfFire,
  Range,
  Reliability,
  ArmorType,
  ActionType,
  UserType,
} from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to format values for TypeScript
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return 'null';
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "\\'")}'`;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  return `'${String(value).replace(/'/g, "\\'")}'`;
}

// Helper function to convert an object to a TypeScript object literal string, quoting only strings
function objectToTs(obj: Record<string, any>): string {
  return (
    '{\n' +
    Object.entries(obj)
      .map(([key, value]) => {
        if (value === null || value === undefined) return `  ${key}: null,`;
        if (typeof value === 'string') {
          // Handle enum values
          if (key === 'classification') {
            return `  ${key}: ClassClassification.${value},`;
          }
          if (
            key === 'type' &&
            ['RACE', 'PATH', 'SPECIALISATION'].includes(value)
          ) {
            return `  ${key}: ClassClassification.${value},`;
          }
          if (
            key === 'type' &&
            ['MELEE', 'RANGED', 'ARMOR', 'MISCELLANEOUS'].includes(value)
          ) {
            return `  ${key}: GearType.${value},`;
          }
          if (
            key === 'rateOfFire' &&
            ['SINGLE', 'BURST', 'FULL'].includes(value)
          ) {
            return `  ${key}: RateOfFire.${value},`;
          }
          if (
            key === 'range' &&
            ['NEARBY', 'MEDIUM', 'LONG', 'EXTREME'].includes(value)
          ) {
            return `  ${key}: Range.${value},`;
          }
          if (
            key === 'reliability' &&
            ['RELIABLE', 'NORMAL', 'UNRELIABLE'].includes(value)
          ) {
            return `  ${key}: Reliability.${value},`;
          }
          if (key === 'armorType' && ['OUTFIT', 'HARDENED'].includes(value)) {
            return `  ${key}: ArmorType.${value},`;
          }
          if (
            key === 'actionType' &&
            ['STANDARD', 'MINOR', 'REACTION', 'FREE', 'MOVE'].includes(value)
          ) {
            return `  ${key}: ActionType.${value},`;
          }
          if (key === 'type' && ['PLAYER', 'GM'].includes(value)) {
            return `  ${key}: UserType.${value},`;
          }
          // Regular string values
          return `  ${key}: '${value.replace(/'/g, "\\'")}',`;
        }
        return `  ${key}: ${value},`;
      })
      .join('\n') +
    '\n}'
  );
}

async function generateSeedFromDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log('Fetching data from database...');

    // Fetch all static data
    const data = {
      classes: await prisma.class.findMany({
        include: {
          classLevels: true,
        },
      }),
      items: await prisma.item.findMany(),
      users: await prisma.user.findMany(),
      selectableFeatureLists: await prisma.selectableFeatureList.findMany({
        include: {
          selectableFeatures: true,
        },
      }),
    };

    let seedContent = `import { PrismaClient, ClassClassification, GearType, RateOfFire, Range, Reliability, ArmorType, ActionType, UserType } from '@prisma/client';\n`;
    seedContent += `const prisma = new PrismaClient();\n\n`;
    seedContent += `async function main() {\n`;
    seedContent += `  console.log('Start seeding static data...');\n\n`;

    // Generate classes with upsert
    if (data.classes.length > 0) {
      seedContent += `  // Upsert Classes\n`;
      for (const cls of data.classes) {
        const classData = {
          name: cls.name,
          classification: cls.classification,
          ...(cls.minMight !== null && { minMight: cls.minMight }),
          ...(cls.minIntellect !== null && { minIntellect: cls.minIntellect }),
          ...(cls.minSpirit !== null && { minSpirit: cls.minSpirit }),
        };

        seedContent += `  const classData_${cls.id} = ${objectToTs(classData)};\n\n`;
        seedContent += `  await prisma.class.upsert({\n`;
        seedContent += `    where: { id: ${cls.id} },\n`;
        seedContent += `    update: classData_${cls.id},\n`;
        seedContent += `    create: { id: ${cls.id}, ...classData_${cls.id} },\n`;
        seedContent += `  });\n\n`;
      }
    }

    // Generate class levels with upsert
    if (data.classes.some((c) => c.classLevels.length > 0)) {
      seedContent += `  // Upsert Class Levels\n`;
      for (const cls of data.classes) {
        if (cls.classLevels.length > 0) {
          for (const level of cls.classLevels) {
            const levelData = {
              classId: level.classId,
              level: level.level,
              health: level.health,
              statBonus: level.statBonus,
            };

            seedContent += `  const levelData_${level.id} = ${objectToTs(levelData)};\n\n`;
            seedContent += `  await prisma.classLevel.upsert({\n`;
            seedContent += `    where: { id: ${level.id} },\n`;
            seedContent += `    update: levelData_${level.id},\n`;
            seedContent += `    create: { id: ${level.id}, ...levelData_${level.id} },\n`;
            seedContent += `  });\n\n`;
          }
        }
      }
    }

    // Generate items with upsert
    if (data.items.length > 0) {
      seedContent += `  // Upsert Items\n`;
      for (const item of data.items) {
        const itemData = {
          name: item.name,
          type: item.type,
          rank: item.rank,
          ...(item.damageUnarmored !== null && {
            damageUnarmored: item.damageUnarmored,
          }),
          ...(item.damageArmored !== null && {
            damageArmored: item.damageArmored,
          }),
          concealable: item.concealable,
          twoHanded: item.twoHanded,
          reach: item.reach,
          finesse: item.finesse,
          thrown: item.thrown,
          ...(item.attacksWorthOfAmmo !== null && {
            attacksWorthOfAmmo: item.attacksWorthOfAmmo,
          }),
          ...(item.rateOfFire !== null && {
            rateOfFire: item.rateOfFire,
          }),
          ...(item.range !== null && { range: item.range }),
          ...(item.reliability !== null && {
            reliability: item.reliability,
          }),
          scatter: item.scatter,
          sniper: item.sniper,
          brace: item.brace,
          ...(item.armorType !== null && {
            armorType: item.armorType,
          }),
          ...(item.soak !== null && { soak: item.soak }),
        };

        seedContent += `  const itemData_${item.id} = ${objectToTs(itemData)};\n\n`;
        seedContent += `  await prisma.item.upsert({\n`;
        seedContent += `    where: { id: ${item.id} },\n`;
        seedContent += `    update: itemData_${item.id},\n`;
        seedContent += `    create: { id: ${item.id}, ...itemData_${item.id} },\n`;
        seedContent += `  });\n\n`;
      }
    }

    // Generate users with upsert
    if (data.users.length > 0) {
      seedContent += `  // Upsert Users\n`;
      for (const user of data.users) {
        const userData = {
          username: user.username,
          password: user.password,
          type: user.type,
        };

        seedContent += `  const userData_${user.id} = ${objectToTs(userData)};\n\n`;
        seedContent += `  await prisma.user.upsert({\n`;
        seedContent += `    where: { id: ${user.id} },\n`;
        seedContent += `    update: userData_${user.id},\n`;
        seedContent += `    create: { id: ${user.id}, ...userData_${user.id} },\n`;
        seedContent += `  });\n\n`;
      }
    }

    // Generate selectable feature lists and features with upsert
    if (data.selectableFeatureLists.length > 0) {
      seedContent += `  // Upsert Selectable Feature Lists and Features\n`;
      for (const list of data.selectableFeatureLists) {
        const listData = {
          name: list.name,
        };

        seedContent += `  const listData_${list.id} = ${objectToTs(listData)};\n\n`;
        seedContent += `  await prisma.selectableFeatureList.upsert({\n`;
        seedContent += `    where: { id: ${list.id} },\n`;
        seedContent += `    update: listData_${list.id},\n`;
        seedContent += `    create: { id: ${list.id}, ...listData_${list.id} },\n`;
        seedContent += `  });\n\n`;

        if (list.selectableFeatures.length > 0) {
          for (const feature of list.selectableFeatures) {
            const featureData = {
              name: feature.name,
              description: feature.description,
              selectableFeatureListId: feature.selectableFeatureListId,
              ...(feature.requiredSelectableFeatureId !== null && {
                requiredSelectableFeatureId:
                  feature.requiredSelectableFeatureId,
              }),
              ...(feature.uses !== null && { uses: feature.uses }),
              ...(feature.actionType !== null && {
                actionType: feature.actionType,
              }),
            };

            seedContent += `  const featureData_${feature.id} = ${objectToTs(featureData)};\n\n`;
            seedContent += `  await prisma.selectableFeature.upsert({\n`;
            seedContent += `    where: { id: ${feature.id} },\n`;
            seedContent += `    update: featureData_${feature.id},\n`;
            seedContent += `    create: { id: ${feature.id}, ...featureData_${feature.id} },\n`;
            seedContent += `  });\n\n`;
          }
        }
      }
    }

    seedContent += `  console.log('Static data seeding finished.');\n`;
    seedContent += `  console.log('Note: Dynamic data (creatures, etc.) was preserved.');\n`;
    seedContent += `}\n\n`;
    seedContent += `main()\n`;
    seedContent += `  .catch(async (e) => {\n`;
    seedContent += `    console.error(e);\n`;
    seedContent += `    process.exit(1);\n`;
    seedContent += `  })\n`;
    seedContent += `  .finally(async () => {\n`;
    seedContent += `    await prisma.$disconnect();\n`;
    seedContent += `  });\n`;

    // Write the generated seed file
    const seedPath = path.join(__dirname, '../prisma/seed.ts');
    fs.writeFileSync(seedPath, seedContent);

    console.log(`Generated seed file from current database!`);
    console.log(`Location: ${seedPath}`);
    console.log(`\nSummary of static data found:`);
    console.log(`- Classes: ${data.classes.length}`);
    console.log(`- Items: ${data.items.length}`);
    console.log(`- Users: ${data.users.length}`);
    console.log(
      `- Selectable Feature Lists: ${data.selectableFeatureLists.length}`
    );
    console.log(`\nNote: Using upsert operations with proper type handling.`);
  } catch (error) {
    console.error('Failed to generate seed file:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

generateSeedFromDatabase();
