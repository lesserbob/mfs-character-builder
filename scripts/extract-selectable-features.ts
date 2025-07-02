import { PrismaClient, ActionType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to convert an object to a TypeScript object literal string
function objectToTs(obj: Record<string, any>): string {
  return (
    '{\n' +
    Object.entries(obj)
      .map(([key, value]) => {
        if (value === null || value === undefined) return `  ${key}: null,`;
        if (typeof value === 'string') {
          // Handle enum values
          if (
            key === 'actionType' &&
            ['STANDARD', 'MINOR', 'REACTION', 'FREE', 'MOVE'].includes(value)
          ) {
            return `  ${key}: ActionType.${value},`;
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

async function extractSelectableFeatures() {
  const prisma = new PrismaClient();

  try {
    console.log('Fetching SelectableFeature data from database...');

    // Fetch all selectable features
    const features = await prisma.selectableFeature.findMany({
      orderBy: { id: 'asc' },
    });

    console.log(`Found ${features.length} selectable features`);

    // Generate the seed data array
    let seedContent = `  const selectableFeatures = [\n`;

    for (const feature of features) {
      const featureData = {
        id: feature.id,
        name: feature.name,
        description: feature.description,
        selectableFeatureListId: feature.selectableFeatureListId,
        ...(feature.requiredSelectableFeatureId !== null && {
          requiredSelectableFeatureId: feature.requiredSelectableFeatureId,
        }),
        ...(feature.uses !== null && { uses: feature.uses }),
        ...(feature.actionType !== null && {
          actionType: feature.actionType,
        }),
      };

      seedContent += `    ${objectToTs(featureData)},\n`;
    }

    seedContent += `  ];\n\n`;
    seedContent += `  for (const feature of selectableFeatures) {\n`;
    seedContent += `    const { id, ...featureData } = feature;\n`;
    seedContent += `    await prisma.selectableFeature.upsert({\n`;
    seedContent += `      where: { id },\n`;
    seedContent += `      update: featureData,\n`;
    seedContent += `      create: { id, ...featureData },\n`;
    seedContent += `    });\n`;
    seedContent += `  }\n`;

    // Write to a file
    const outputPath = path.join(__dirname, '../selectable-features-seed.txt');
    fs.writeFileSync(outputPath, seedContent);

    console.log(`\nExtracted SelectableFeature data!`);
    console.log(`Location: ${outputPath}`);
    console.log(`\nFeatures found:`);
    features.forEach((f) => {
      console.log(
        `- ID ${f.id}: ${f.name} (List: ${f.selectableFeatureListId})`
      );
    });
  } catch (error) {
    console.error('Failed to extract SelectableFeature data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

extractSelectableFeatures();
