const prisma = require('../../config/prisma');

const getAllTasks = async (userId, role) => {
  const queryOptions = {
    orderBy: { createdAt: 'desc' },
  };

  if (role === 'ADMIN') {
    queryOptions.include = {
      user: {
        select: {
          email: true,
        },
      },
    };
  } else {
    queryOptions.where = { userId };
  }

  return await prisma.task.findMany(queryOptions);
};

const createTask = async (userId, taskData) => {
  return await prisma.task.create({
    data: {
      ...taskData,
      userId,
    },
  });
};

const updateTask = async (taskId, userId, role, data) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (role === 'USER' && task.userId !== userId) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  return await prisma.task.update({
    where: { id: taskId },
    data,
  });
};

const deleteTask = async (taskId, userId, role) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (role === 'USER' && task.userId !== userId) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: 'Task deleted' };
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
