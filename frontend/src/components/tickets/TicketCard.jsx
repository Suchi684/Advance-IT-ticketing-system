import { useNavigate } from 'react-router-dom';
import { FiMail, FiClock, FiUser } from 'react-icons/fi';
import Badge from '../common/Badge';
import { getCategoryColor, getCategoryLabel, getStatusColor, getStatusLabel } from '../../utils/constants';
import { useCategories } from '../../context/CategoriesContext';
import { formatRelative } from '../../utils/dateFormatter';

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();
  const { categories } = useCategories();

  return (
    <div className="ticket-card" onClick={() => navigate(`/tickets/${ticket.id}`)}>
      <div className="ticket-card-header">
        <div className="ticket-card-badges">
          <Badge label={getCategoryLabel(ticket.category, categories)} color={getCategoryColor(ticket.category, categories)} />
          <Badge label={getStatusLabel(ticket.status)} color={getStatusColor(ticket.status)} />
        </div>
        <span className="ticket-card-id">#{ticket.id}</span>
      </div>
      <h3 className="ticket-card-subject">{ticket.subject || '(No Subject)'}</h3>
      <div className="ticket-card-meta">
        <span><FiMail /> {ticket.fromEmail}</span>
        <span><FiClock /> {formatRelative(ticket.receivedDate)}</span>
        {ticket.assignedAgentName && (
          <span><FiUser /> {ticket.assignedAgentName}</span>
        )}
      </div>
      <p className="ticket-card-preview">
        {ticket.body ? ticket.body.substring(0, 120) + '...' : 'No content'}
      </p>
    </div>
  );
}
