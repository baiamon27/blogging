// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>Blog Platform</Link>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>Home</Link>
          {user ? (
            <>
              <Link to="/create" style={styles.link}>Create Post</Link>
              <span style={styles.userName}>{user.username}</span>
              <button onClick={handleLogout} style={styles.button}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#2c3e50',
    padding: '1rem 0',
    color: 'white'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    color: 'white',
    fontSize: '1.5rem',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    transition: 'opacity 0.3s'
  },
  userName: {
    marginLeft: '1rem',
    fontWeight: 'bold'
  },
  button: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '3px',
    cursor: 'pointer'
  }
};

export default Navbar;