import React from 'react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffa500'; // Yellow/Orange
      case 'in-progress':
        return '#2196F3'; // Blue
      case 'completed':
        return '#4CAF50'; // Green
      default:
        return '#888';
    }
  };

  return (
    <div className="task-card" style={{
      border: '1px solid #444',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      textAlign: 'left',
      backgroundColor: '#2a2a2a'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h3>
        <span style={{
          backgroundColor: getStatusColor(task.status),
          color: task.status === 'pending' ? 'black' : 'white',
          padding: '0.2rem 0.6rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          fontWeight: 'bold'
        }}>
          {task.status}
        </span>
      </div>
      <p style={{ color: '#bbb', marginBottom: '1rem' }}>{task.description || 'No description provided.'}</p>
      {task.user?.email && (
        <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>
          Owner: {task.user.email}
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={() => onEdit(task)}
          className="btn btn-sm btn-edit"
          style={{ width: 'auto', fontSize: '0.8rem' }}
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className="btn btn-sm btn-delete"
          style={{ width: 'auto', fontSize: '0.8rem' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
