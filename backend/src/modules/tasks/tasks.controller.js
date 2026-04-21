const prisma = require('../../config/prisma');

const getTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  const { title, description, status } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'pending',
        userId: req.user.id,
      },
    });
    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status },
    });

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await prisma.task.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Task removed',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
