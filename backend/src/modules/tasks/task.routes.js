const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('./task.controller');
const { createTaskSchema, updateTaskSchema } = require('./task.schema');
const validate = require('../../middlewares/validate');
const { authenticate, roleGuard } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Protect all task routes
router.use(authenticate);

router.get('/', getTasks);
router.get('/admin/all', roleGuard('ADMIN'), getTasks);
router.post('/', validate(createTaskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
