
const prisma = require('../src/lib/prisma');

// Clean DB before each test suite
beforeAll(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

module.exports = prisma;