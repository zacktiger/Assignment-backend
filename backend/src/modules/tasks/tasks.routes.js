const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('./tasks.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
