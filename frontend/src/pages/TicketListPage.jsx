import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTickets } from '../services/ticketService';
import TicketCard from '../components/tickets/TicketCard';
import TicketFilters from '../components/tickets/TicketFilters';
import Spinner from '../components/common/Spinner';

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

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilters(prev => ({ ...prev, category: cat, page: 0 }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTickets();
  }, [filters]);

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
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
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
          <div className="ticket-list">
            {tickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
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
    </div>
  );
}
