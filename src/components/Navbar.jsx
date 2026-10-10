import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, PlusCircle, Scale, LogOut, LogIn, UserPlus, Layers } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        backgroundColor: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0.875rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)',
            }}
          >
            <Layers size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Idea<span style={{ color: 'var(--primary)' }}>Forge</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)',
                }}
              >
                <Compass size={16} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/compare"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive('/compare') ? 'var(--primary)' : 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)',
                }}
              >
                <Scale size={16} />
                <span>Compare</span>
              </Link>

              <Link to="/wizard" className="btn btn-primary" style={{ padding: '0.45rem 0.85rem' }}>
                <PlusCircle size={15} />
                <span>New Idea</span>
              </Link>
            </>
          )}
        </nav>

        {/* User / Auth State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  {user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Student Innovator'}
                </div>
              </div>
              <button
                className="btn btn-outline"
                onClick={handleLogout}
                style={{ padding: '0.45rem 0.75rem' }}
                title="Sign out"
              >
                <LogOut size={15} />
                <span style={{ fontSize: '0.825rem' }}>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.45rem 0.85rem' }}>
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 0.85rem' }}>
                <UserPlus size={15} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
