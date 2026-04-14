import { FiSearch } from 'react-icons/fi';
import { STATUSES } from '../../utils/constants';
import { useCategories } from '../../context/CategoriesContext';

export default function TicketFilters({ filters, onChange }) {
  const { categories } = useCategories();

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 0 });
  };

  return (
    <div className="ticket-filters">
      <div className="filter-search">
        <FiSearch />
        <input
          type="text"
          placeholder="Search tickets..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>
      <select value={filters.category || ''} onChange={(e) => handleChange('category', e.target.value)}>
        <option value="">All Categories</option>
        {(categories || []).map(c => (
          <option key={c.name} value={c.name}>{c.label || c.name}</option>
        ))}
      </select>
      <select value={filters.status || ''} onChange={(e) => handleChange('status', e.target.value)}>
        <option value="">All Statuses</option>
        {STATUSES.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
