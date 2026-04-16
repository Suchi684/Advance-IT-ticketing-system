import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiSun, FiMoon } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-title">
        <h1>E-Commerce Support Tickets</h1>
      </div>
      <div className="header-user">
        <div className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <span className="theme-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
          <div className="theme-toggle-track">
            <div className="theme-toggle-thumb">
              {isDark ? <FiMoon size={11} /> : <FiSun size={11} />}
            </div>
          </div>
        </div>
        <FiUser />
        <span>{user?.name || 'Agent'}</span>
        <button className="btn-logout" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
}
