import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Toast from '../components/Toast';
import { fetchTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../api/tasks';
import { getErrorMessage } from '../utils/errorHandler';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  
  const [toast, setToast] = useState({ message: '', type: '' });
  const { user, logout } = useAuth();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasksApi();
      setTasks(data);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    setActionLoading(true);
    try {
      const data = await createTaskApi(taskData);
      setTasks([data, ...tasks]);
      showToast('Task created successfully!');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    setActionLoading(true);
    try {
      const data = await updateTaskApi(editingTask.id, taskData);
      setTasks(tasks.map((t) => (t.id === editingTask.id ? data : t)));
      setEditingTask(null);
      showToast('Task updated successfully!');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(id);
    try {
      await deleteTaskApi(id);
      setTasks(tasks.filter((t) => t.id !== id));
      showToast('Task deleted successfully!');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span className="role-badge">{user.role}</span>
          <span>{user.email}</span>
          <button onClick={logout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="task-form-section">
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            initialData={editingTask}
            onCancel={editingTask ? () => setEditingTask(null) : null}
            isLoading={actionLoading}
          />
        </section>

        <section className="task-list-section">
          <h2>Your Tasks</h2>
          {loading ? (
            <div className="empty-state">
              <span className="loading-spinner" style={{ borderColor: '#646cff', borderTopColor: 'transparent' }}></span>
              <p>Loading tasks...</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              isDeleting={isDeleting}
            />
          )}
        </section>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />
    </div>
  );
};

export default Dashboard;
