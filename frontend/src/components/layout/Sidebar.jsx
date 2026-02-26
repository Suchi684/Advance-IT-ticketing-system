import { NavLink } from 'react-router-dom';
import { FiHome, FiInbox, FiGrid } from 'react-icons/fi';
import { CATEGORIES } from '../../utils/constants';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>TicketDesk</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FiHome /> Dashboard
        </NavLink>
        <NavLink to="/tickets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FiInbox /> All Tickets
        </NavLink>
        <div className="nav-divider">Categories</div>
        {CATEGORIES.map(cat => (
          <NavLink
            key={cat.value}
            to={`/tickets?category=${cat.value}`}
            className="nav-link nav-category"
          >
            <FiGrid />
            <span className="category-dot" style={{ backgroundColor: cat.color }}></span>
            {cat.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
