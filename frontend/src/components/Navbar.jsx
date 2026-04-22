import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 surface-glass px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-[10px] flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <span className="text-white font-extrabold text-lg">A</span>
          </div>
          <Link to="/dashboard" className="text-xl font-extrabold tracking-tight text-white hover:text-indigo-400 transition-colors">
            AuthApp
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/50 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
            <span className="text-sm font-medium text-slate-300">{user.email}</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
              {user.role}
            </span>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
