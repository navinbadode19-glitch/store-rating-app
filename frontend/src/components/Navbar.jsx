import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import './Navbar.css';

const roleLinks = {
  admin: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ],
  user: [
    { to: '/stores', label: 'Stores' },
    { to: '/change-password', label: 'Password' },
  ],
  owner: [
    { to: '/owner', label: 'Dashboard' },
    { to: '/change-password', label: 'Password' },
  ],
};

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const links = roleLinks[user?.role] || [];

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">★</span>
          <span className="logo-text">StoreRate</span>
        </Link>
      </div>

      <div className="navbar-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="nav-link" id={`nav-${link.label.toLowerCase()}`}>
            {link.label}
          </Link>
        ))}
      </div>

      <div className="navbar-user">
        <span className="user-badge">{user?.role?.toUpperCase()}</span>
        <span className="user-name">{user?.name}</span>
        <button className="btn-logout" onClick={handleLogout} id="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
