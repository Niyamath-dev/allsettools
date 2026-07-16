// scratch/test-connection.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing connection to database...');
    // Run a simple query to verify database connectivity
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Connection Successful! Database is connected and accessible.');
  } catch (error) {
    console.error('❌ Connection Failed!');
    console.error('Error Details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
