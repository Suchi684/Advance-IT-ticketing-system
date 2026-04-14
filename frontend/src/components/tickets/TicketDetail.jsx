import Badge from '../common/Badge';
import { getCategoryColor, getCategoryLabel, getStatusColor, getStatusLabel } from '../../utils/constants';
import { useCategories } from '../../context/CategoriesContext';
import { formatDate } from '../../utils/dateFormatter';
import { FiPaperclip } from 'react-icons/fi';

export default function TicketDetail({ ticket }) {
  const { categories } = useCategories();
  const attachments = ticket.attachmentInfo ? JSON.parse(ticket.attachmentInfo) : [];

  return (
    <div className="ticket-detail">
      <div className="ticket-detail-header">
        <h2>{ticket.subject || '(No Subject)'}</h2>
        <div className="ticket-detail-badges">
          <Badge label={getCategoryLabel(ticket.category, categories)} color={getCategoryColor(ticket.category, categories)} />
          <Badge label={getStatusLabel(ticket.status)} color={getStatusColor(ticket.status)} />
          <Badge label={ticket.priority} color={ticket.priority === 'URGENT' ? '#e74c3c' : ticket.priority === 'HIGH' ? '#f39c12' : '#A0516B'} />
        </div>
      </div>

      <div className="ticket-detail-info">
        <div className="info-row">
          <strong>From:</strong> <span>{ticket.fromEmail}</span>
        </div>
        <div className="info-row">
          <strong>To:</strong> <span>{ticket.toEmail}</span>
        </div>
        <div className="info-row">
          <strong>Date:</strong> <span>{formatDate(ticket.receivedDate)}</span>
        </div>
        {ticket.assignedAgentName && (
          <div className="info-row">
            <strong>Assigned To:</strong> <span>{ticket.assignedAgentName}</span>
          </div>
        )}
        <div className="info-row">
          <strong>Ticket ID:</strong> <span>#{ticket.id}</span>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="ticket-attachments">
          <h4><FiPaperclip /> Attachments ({attachments.length})</h4>
          <div className="attachment-list">
            {attachments.map((att, idx) => (
              <div key={idx} className="attachment-item">
                <FiPaperclip /> {att.name} <span className="att-size">({att.size} bytes)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ticket-body">
        {ticket.htmlBody ? (
          <iframe
            title="Email Body"
            srcDoc={ticket.htmlBody}
            className="email-iframe"
            sandbox="allow-same-origin"
          />
        ) : (
          <pre className="email-text">{ticket.body || 'No content'}</pre>
        )}
      </div>
    </div>
  );
}
