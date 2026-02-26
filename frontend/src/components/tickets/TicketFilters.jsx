import { FiSearch } from 'react-icons/fi';
import { CATEGORIES, STATUSES } from '../../utils/constants';

export default function TicketFilters({ filters, onChange }) {
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
        {CATEGORIES.map(c => (
          <option key={c.value} value={c.value}>{c.label}</option>
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
