import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportData() {
  console.log('Exporting database data...');

  const exportDir = path.join(__dirname, '../data-exports');

  // Create export directory if it doesn't exist
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const exportPath = path.join(exportDir, `export-${timestamp}`);

  // Create timestamped directory
  fs.mkdirSync(exportPath, { recursive: true });

  try {
    // Export all data
    const data = {
      classes: await prisma.class.findMany({
        include: {
          classLevels: {
            include: {
              classFeatures: true,
            },
          },
        },
      }),
      items: await prisma.item.findMany(),
      users: await prisma.user.findMany(),
      creatures: await prisma.creature.findMany({
        include: {
          classes: {
            include: {
              class: true,
            },
          },
          features: {
            include: {
              feature: true,
            },
          },
        },
      }),
      selectableFeatureLists: await prisma.selectableFeatureList.findMany({
        include: {
          selectableFeatures: true,
        },
      }),
    };

    // Write each table to a separate file
    for (const [tableName, tableData] of Object.entries(data)) {
      const filePath = path.join(exportPath, `${tableName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(tableData, null, 2));
      console.log(
        `Exported ${tableName}: ${Array.isArray(tableData) ? tableData.length : 1} records`
      );
    }

    // Create a summary file
    const summary = {
      exportDate: new Date().toISOString(),
      tables: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.length : 1,
        ])
      ),
    };

    fs.writeFileSync(
      path.join(exportPath, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log(`\nExport completed successfully!`);
    console.log(`Export location: ${exportPath}`);
    console.log(`\nSummary:`);
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

exportData()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
