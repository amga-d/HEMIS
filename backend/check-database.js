const prisma = require('./services/prismaClient');

async function checkDatabase() {
  try {
    console.log('Checking database...');

    // Check users
    const users = await prisma.user.findMany();
    console.log('Users:', users);

    // Check hospitals
    const hospitals = await prisma.hospital.findMany();
    console.log('Hospitals:', hospitals);

    // Check existing insights
    const insights = await prisma.aiInsight.findMany();
    console.log('Existing insights:', insights.length);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
