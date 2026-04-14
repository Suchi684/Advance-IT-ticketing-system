import { useState, useEffect } from 'react';
import { getAssignedTickets } from '../services/ticketService';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/tickets/TicketCard';
import Spinner from '../components/common/Spinner';
import { FiClipboard, FiInbox } from 'react-icons/fi';

export default function AssignedTasksPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchAssigned();
  }, [page]);

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const res = await getAssignedTickets({ page, size: 20 });
      setTickets(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch assigned tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assigned-tasks-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <FiClipboard className="page-header-icon" />
          <div>
            <h2>My Assigned Tasks</h2>
            <p className="page-header-sub">Tickets assigned to {user?.name || 'you'}</p>
          </div>
        </div>
        {!loading && (
          <div className="assigned-count-badge">
            <span>{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : tickets.length === 0 ? (
        <div className="empty-state-card animate-fade-in-up">
          <div className="empty-state-icon">
            <FiInbox size={48} />
          </div>
          <h3>No assigned tickets</h3>
          <p>You don't have any tickets assigned to you yet.</p>
        </div>
      ) : (
        <>
          <div className="ticket-list stagger-children">
            {tickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span>Page {page + 1} of {totalPages}</span>
              <button
                className="btn btn-secondary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
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
