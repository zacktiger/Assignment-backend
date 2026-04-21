import axiosInstance from './axiosInstance';

export const fetchTasksApi = async () => {
  const response = await axiosInstance.get('/tasks');
  return response.data.data;
};

export const createTaskApi = async (taskData) => {
  const response = await axiosInstance.post('/tasks', taskData);
  return response.data.data;
};

export const updateTaskApi = async (id, taskData) => {
  const response = await axiosInstance.put(`/tasks/${id}`, taskData);
  return response.data.data;
};

export const deleteTaskApi = async (id) => {
  const response = await axiosInstance.delete(`/tasks/${id}`);
  return response.data.data;
};
