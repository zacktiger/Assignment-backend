const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const prisma = require('./config/prisma');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scalable REST API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Task Management application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
});

app.use(globalLimiter);
app.use('/api/v1/auth/login', strictAuthLimiter);
app.use('/api/v1/auth/register', strictAuthLimiter);

app.get('/test', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Routes
app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
app.use('/api/v1/tasks', require('./modules/tasks/task.routes'));

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
