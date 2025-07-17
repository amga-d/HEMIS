const prisma = require('./services/prismaClient');
const bcrypt = require('bcrypt');

async function createTestUser() {
  try {
    console.log('Creating test user...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: hashedPassword,
      },
    });

    console.log('Test user created:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
