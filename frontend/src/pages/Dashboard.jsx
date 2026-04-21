import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setStatus(editingTask.status);
      setShowForm(true);
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
    }
  }, [editingTask]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = { title, description, status };
      if (editingTask) {
        const updated = await updateTask(editingTask.id, taskData);
        setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        setEditingTask(null);
      } else {
        const created = await createTask(taskData);
        setTasks([created, ...tasks]);
      }
      setShowForm(false);
      setTitle('');
      setDescription('');
      setStatus('pending');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Dashboard</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Logged in as: <strong>{user.email}</strong> ({user.role})</span>
            <button onClick={handleLogout} className="btn btn-logout" style={{ width: 'auto', backgroundColor: '#ff4d4d' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {error && <p className="error-message" style={{ color: '#ff4d4d', background: 'rgba(255,77,77,0.1)', padding: '1rem', borderRadius: '4px' }}>{error}</p>}

      <section className="dashboard-actions" style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if (editingTask) setEditingTask(null);
          }} 
          className="btn btn-primary"
          style={{ width: 'auto' }}
        >
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>
      </section>

      {showForm && (
        <section className="task-form-section" style={{ marginBottom: '3rem', textAlign: 'left', maxWidth: '500px' }}>
          <form onSubmit={handleSubmit} className="task-form">
            <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </form>
        </section>
      )}

      <section className="task-list-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Your Tasks</h2>
          {user.role === 'ADMIN' && (
            <button 
              onClick={async () => {
                setLoading(true);
                try {
                  const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/admin/all`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                  });
                  const json = await response.json();
                  setTasks(json.data);
                } catch (err) {
                  setError('Failed to fetch admin tasks');
                } finally {
                  setLoading(false);
                }
              }}
              className="btn btn-secondary"
              style={{ width: 'auto' }}
            >
              View System-wide Tasks (Admin)
            </button>
          )}
        </div>
        
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found. Create one above!</p>
        ) : (
          <div className="task-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={setEditingTask} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
