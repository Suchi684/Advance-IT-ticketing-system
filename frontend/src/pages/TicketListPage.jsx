import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTickets, bulkUpdateStatus, bulkAssign } from '../services/ticketService';
import { getAgents } from '../services/userService';
import TicketCard from '../components/tickets/TicketCard';
import TicketFilters from '../components/tickets/TicketFilters';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';
import { STATUSES } from '../utils/constants';

export default function TicketListPage() {
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    status: '',
    search: '',
    page: 0,
    size: 20,
  });

  // Bulk operations state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [agents, setAgents] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkAgentId, setBulkAgentId] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilters(prev => ({ ...prev, category: cat, page: 0 }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  useEffect(() => {
    getAgents().then(res => setAgents(res.data)).catch(() => {});
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      params.page = filters.page;
      params.size = filters.size;

      const res = await getTickets(params);
      setTickets(res.data.content);
      setTotalPages(res.data.totalPages);
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (ticketId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(ticketId)) {
        next.delete(ticketId);
      } else {
        next.add(ticketId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === tickets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tickets.map(t => t.id)));
    }
  };

  const handleBulkStatus = async () => {
    if (!bulkStatus || selectedIds.size === 0) return;
    setBulkLoading(true);
    try {
      await bulkUpdateStatus(Array.from(selectedIds), bulkStatus);
      toast.success(`Updated ${selectedIds.size} tickets to ${bulkStatus}`);
      setBulkStatus('');
      fetchTickets();
    } catch {
      toast.error('Failed to bulk update status');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkAgentId || selectedIds.size === 0) return;
    setBulkLoading(true);
    try {
      await bulkAssign(Array.from(selectedIds), Number(bulkAgentId));
      toast.success(`Assigned ${selectedIds.size} tickets`);
      setBulkAgentId('');
      fetchTickets();
    } catch {
      toast.error('Failed to bulk assign');
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="ticket-list-page">
      <h2>Tickets</h2>
      <TicketFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <Spinner />
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <p>No tickets found</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.9rem', color: '#7f8c8d' }}>
              <input
                type="checkbox"
                checked={selectedIds.size === tickets.length && tickets.length > 0}
                onChange={toggleSelectAll}
                style={{ width: 16, height: 16 }}
              />
              Select All
            </label>
            {selectedIds.size > 0 && (
              <span style={{ fontSize: '0.85rem', color: '#A0516B', fontWeight: 500 }}>
                ({selectedIds.size} selected)
              </span>
            )}
          </div>

          <div className="ticket-list">
            {tickets.map(ticket => (
              <div key={ticket.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(ticket.id)}
                  onChange={() => toggleSelect(ticket.id)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginTop: 18, width: 16, height: 16, flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <TicketCard ticket={ticket} />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                disabled={filters.page === 0}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </button>
              <span>Page {filters.page + 1} of {totalPages}</span>
              <button
                className="btn btn-secondary"
                disabled={filters.page >= totalPages - 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedIds.size > 0 && (
        <div className="bulk-bar">
          <span className="bulk-count">{selectedIds.size} ticket{selectedIds.size > 1 ? 's' : ''} selected</span>

          <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
            <option value="">Change Status...</option>
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleBulkStatus} disabled={!bulkStatus || bulkLoading}>
            Apply Status
          </button>

          <select value={bulkAgentId} onChange={(e) => setBulkAgentId(e.target.value)}>
            <option value="">Assign To...</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleBulkAssign} disabled={!bulkAgentId || bulkLoading}>
            Assign
          </button>
        </div>
      )}
    </div>
  );
}
