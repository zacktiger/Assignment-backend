const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const prisma = require('./config/prisma');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/test', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Routes
app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
app.use('/api/v1/tasks', require('./modules/tasks/tasks.routes'));

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
