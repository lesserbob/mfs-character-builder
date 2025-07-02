import { PrismaClient, ClassFeatureType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function extractClassFeatures() {
  const prisma = new PrismaClient();

  try {
    console.log('Fetching ClassFeature data from database...');

    const classFeatures = await prisma.classFeature.findMany({
      orderBy: { id: 'asc' },
    });

    if (classFeatures.length === 0) {
      console.log('No ClassFeature data found in database.');
      return;
    }

    console.log(`Found ${classFeatures.length} ClassFeature records.`);

    // Generate the ClassFeature data array
    let classFeatureData = '  const classFeatures: Array<{\n';
    classFeatureData += '    id: number;\n';
    classFeatureData += '    name: string;\n';
    classFeatureData += '    description: string;\n';
    classFeatureData += '    classLevelId: number;\n';
    classFeatureData += '    type: ClassFeatureType;\n';
    classFeatureData += '    display: boolean;\n';
    classFeatureData += '    enduranceRegeneration?: number | null;\n';
    classFeatureData += '    selectableFeatureListId?: number | null;\n';
    classFeatureData += '    selectableFeatureCount?: number | null;\n';
    classFeatureData += '  }> = [\n';

    for (const feature of classFeatures) {
      classFeatureData += '    {\n';
      classFeatureData += `      id: ${feature.id},\n`;
      classFeatureData += `      name: '${feature.name.replace(/'/g, "\\'")}',\n`;
      classFeatureData += `      description: '${feature.description.replace(/'/g, "\\'")}',\n`;
      classFeatureData += `      classLevelId: ${feature.classLevelId},\n`;
      classFeatureData += `      type: ClassFeatureType.${feature.type},\n`;
      classFeatureData += `      display: ${feature.display},\n`;

      if (feature.enduranceRegeneration !== null) {
        classFeatureData += `      enduranceRegeneration: ${feature.enduranceRegeneration},\n`;
      }

      if (feature.selectableFeatureListId !== null) {
        classFeatureData += `      selectableFeatureListId: ${feature.selectableFeatureListId},\n`;
      }

      if (feature.selectableFeatureCount !== null) {
        classFeatureData += `      selectableFeatureCount: ${feature.selectableFeatureCount},\n`;
      }

      classFeatureData += '    },\n';
    }

    classFeatureData += '  ];\n';

    console.log('\nGenerated ClassFeature data:');
    console.log(classFeatureData);

    // Read the current seed file
    const seedPath = path.join(__dirname, '../prisma/seed.ts');
    let seedContent = fs.readFileSync(seedPath, 'utf8');

    // Find the ClassFeature section and replace it
    const classFeatureSectionRegex =
      /  \/\/ Upsert Class Features[\s\S]*?  \];\n\n  for \(const feature of classFeatures\)/;

    if (classFeatureSectionRegex.test(seedContent)) {
      // Replace existing section
      seedContent = seedContent.replace(
        classFeatureSectionRegex,
        `  // Upsert Class Features\n${classFeatureData}\n  for (const feature of classFeatures)`
      );
    } else {
      console.log(
        'Could not find ClassFeature section in seed file. Please add it manually.'
      );
      console.log('\nAdd this data to your seed file:');
      console.log(classFeatureData);
    }

    // Write the updated seed file
    fs.writeFileSync(seedPath, seedContent);

    console.log('\n✅ Updated seed.ts with ClassFeature data!');
    console.log(`Location: ${seedPath}`);
  } catch (error) {
    console.error('Failed to extract ClassFeature data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

extractClassFeatures();
