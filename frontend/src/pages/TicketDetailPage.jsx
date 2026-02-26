import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, updateStatus } from '../services/ticketService';
import { getReplies } from '../services/replyService';
import TicketDetail from '../components/tickets/TicketDetail';
import ReplyModal from '../components/modals/ReplyModal';
import ForwardModal from '../components/modals/ForwardModal';
import ForwardAllModal from '../components/modals/ForwardAllModal';
import AssignModal from '../components/modals/AssignModal';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/dateFormatter';
import { STATUSES } from '../utils/constants';
import { FiCornerUpLeft, FiShare, FiUsers, FiSend, FiArrowLeft } from 'react-icons/fi';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyOpen, setReplyOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardAllOpen, setForwardAllOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ticketRes, repliesRes] = await Promise.all([
        getTicketById(id),
        getReplies(id),
      ]);
      setTicket(ticketRes.data);
      setReplies(repliesRes.data);
    } catch (err) {
      toast.error('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateStatus(id, newStatus);
      setTicket(res.data);
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Spinner />;
  if (!ticket) return <div className="empty-state">Ticket not found</div>;

  return (
    <div className="ticket-detail-page">
      <div className="ticket-detail-top-bar">
        <button className="btn btn-secondary" onClick={() => navigate('/tickets')}>
          <FiArrowLeft /> Back to Tickets
        </button>
        <div className="status-select">
          <label>Status:</label>
          <select value={ticket.status} onChange={(e) => handleStatusChange(e.target.value)}>
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <TicketDetail ticket={ticket} />

      <div className="ticket-actions">
        <button className="btn btn-primary" onClick={() => setReplyOpen(true)}>
          <FiCornerUpLeft /> Reply
        </button>
        <button className="btn btn-secondary" onClick={() => setForwardOpen(true)}>
          <FiShare /> Forward
        </button>
        <button className="btn btn-secondary" onClick={() => setAssignOpen(true)}>
          <FiUsers /> Assign to Agent
        </button>
        <button className="btn btn-secondary" onClick={() => setForwardAllOpen(true)}>
          <FiSend /> Forward All
        </button>
      </div>

      {replies.length > 0 && (
        <div className="ticket-replies">
          <h3>Replies & Forwards ({replies.length})</h3>
          {replies.map(reply => (
            <div key={reply.id} className={`reply-card ${reply.replyType === 'FORWARD' ? 'reply-forward' : ''}`}>
              <div className="reply-header">
                <span className="reply-type">{reply.replyType}</span>
                <span className="reply-by">{reply.sentByAgentName}</span>
                <span className="reply-date">{formatDate(reply.sentDate)}</span>
              </div>
              <div className="reply-meta">
                <span>To: {reply.toEmail}</span>
              </div>
              <div className="reply-body">{reply.body}</div>
            </div>
          ))}
        </div>
      )}

      {ticket && (
        <>
          <ReplyModal isOpen={replyOpen} onClose={() => setReplyOpen(false)} ticket={ticket} onSuccess={fetchData} />
          <ForwardModal isOpen={forwardOpen} onClose={() => setForwardOpen(false)} ticket={ticket} onSuccess={fetchData} />
          <ForwardAllModal isOpen={forwardAllOpen} onClose={() => setForwardAllOpen(false)} ticket={ticket} onSuccess={fetchData} />
          <AssignModal isOpen={assignOpen} onClose={() => setAssignOpen(false)} ticket={ticket} onSuccess={fetchData} />
        </>
      )}
    </div>
  );
}
