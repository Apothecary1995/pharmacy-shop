import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onLoginClick }) => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">EDD Pharmacy</Link>
      </div>
      <nav className="nav-links">
        {isAuthenticated ? (
          <>
          
            <span>Welcome, {user.username}!</span>
            <Link to="">Campaigns</Link>
            {isAdmin && <Link to="/admin">Admin Panel</Link>}
            <Link to="/my-orders">My Orders</Link>
            <Link to="/cart">Cart</Link>
           
            <a href="/" onClick={logout} style={{cursor: 'pointer'}}>Logout</a>
          </>
        ) : (
          <>
            <a href="#" onClick={onLoginClick} style={{cursor: 'pointer'}}>Login / Register</a>
            <Link to="/cart">Cart</Link>
          </>
        )}
      </nav>
    </header>
  );
};
export default Header;