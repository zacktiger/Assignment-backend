const {
  getAllTasks,
  createTask: createTaskService,
  updateTask: updateTaskService,
  deleteTask: deleteTaskService,
} = require('./task.service');

const getTasks = async (req, res, next) => {
  try {
    const tasks = await getAllTasks(req.user.userId, req.user.role);
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await createTaskService(req.user.userId, req.body);
    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await updateTaskService(
      req.params.id,
      req.user.userId,
      req.user.role,
      req.body
    );
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const result = await deleteTaskService(
      req.params.id,
      req.user.userId,
      req.user.role
    );
    res.status(200).json({
      success: true,
      message: result.message,
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
