import { NavLink } from 'react-router-dom';
import { FiHome, FiInbox, FiGrid, FiClipboard, FiUsers, FiSettings, FiBook, FiMessageSquare, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../context/CategoriesContext';

export default function Sidebar() {
  const { user } = useAuth();
  const { categories } = useCategories();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>TicketDesk</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FiHome /> {isAdmin ? 'Dashboard' : 'My Dashboard'}
        </NavLink>
        {isAdmin && (
          <NavLink to="/tickets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FiInbox /> All Tickets
          </NavLink>
        )}
        {!isAdmin && (
          <NavLink to="/assigned" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FiClipboard /> My Tasks
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/agents" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FiUsers /> Agent Performance
          </NavLink>
        )}
        <div className="nav-divider">Categories</div>
        {(categories || []).map(cat => (
          <NavLink
            key={cat.name}
            to={`/tickets?category=${cat.name}`}
            className="nav-link nav-category"
          >
            <FiGrid />
            <span className="category-dot" style={{ backgroundColor: cat.color || '#95a5a6' }}></span>
            {cat.label || cat.name}
          </NavLink>
        ))}
        {isAdmin && (
          <>
            <div className="nav-divider">Admin</div>
            <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FiSettings /> Manage Categories
            </NavLink>
            <NavLink to="/contacts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FiBook /> Contacts
            </NavLink>
            <NavLink to="/canned-responses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FiMessageSquare /> Canned Responses
            </NavLink>
            <NavLink to="/sla-settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FiShield /> SLA Settings
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
