import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
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
        <FiUser />
        <span>{user?.name || 'Agent'}</span>
        <button className="btn-logout" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
}
