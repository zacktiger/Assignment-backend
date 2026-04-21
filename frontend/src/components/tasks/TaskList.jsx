import { useAuth } from '../../context/AuthContext';

const TaskList = ({ tasks, onEdit, onDelete, isDeleting }) => {
  const { user } = useAuth();

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create one above!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <span className={`status-badge ${task.status}`}>
                  {task.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => onEdit(task)}
                  className="btn btn-sm btn-edit"
                  disabled={isDeleting === task.id}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="btn btn-sm btn-delete"
                  disabled={isDeleting === task.id}
                >
                  {isDeleting === task.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
