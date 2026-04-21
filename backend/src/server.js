const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const { PORT } = require('./config/env');

const prisma = new PrismaClient();

async function startServer() {
  try {
    // Attempt to connect to the database
    await prisma.$connect();
    console.log('Successfully connected to the database');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
