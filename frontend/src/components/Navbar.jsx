import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">AuthApp</Link>
      </div>
      <div className="nav-links">
        <span className="user-role">Role: {user.role}</span>
        <button onClick={logout} className="logout-nav-button btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
