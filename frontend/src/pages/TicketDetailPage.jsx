import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, updateStatus, updateDeadline, addNote, updateTicketTags, getActivityLog, submitCsat } from '../services/ticketService';
import { getTags } from '../services/tagService';
import { getReplies } from '../services/replyService';
import TicketDetail from '../components/tickets/TicketDetail';
import ReplyModal from '../components/modals/ReplyModal';
import ForwardModal from '../components/modals/ForwardModal';
import ForwardAllModal from '../components/modals/ForwardAllModal';
import AssignModal from '../components/modals/AssignModal';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/dateFormatter';
import { STATUSES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { FiCornerUpLeft, FiShare, FiUsers, FiSend, FiArrowLeft, FiClock, FiAlertTriangle, FiFileText, FiChevronDown, FiChevronUp, FiX, FiStar } from 'react-icons/fi';

const TAG_COLORS = ['#A0516B', '#6B3A5E', '#D4A0B0', '#332F34', '#C75050', '#7D4568', '#B5AEBB', '#8B4259', '#8C8590', '#9E6880'];

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyOpen, setReplyOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardAllOpen, setForwardAllOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deadlineInput, setDeadlineInput] = useState('');

  // Note state
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteBody, setNoteBody] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);

  // Tags state
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState([]);

  // Activity log state
  const [activityLog, setActivityLog] = useState([]);
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  // CSAT state
  const [csatRating, setCsatRating] = useState(0);
  const [csatHover, setCsatHover] = useState(0);
  const [csatComment, setCsatComment] = useState('');
  const [csatSubmitting, setCsatSubmitting] = useState(false);
  const [csatSubmitted, setCsatSubmitted] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (ticket?.deadline) {
      setDeadlineInput(ticket.deadline.substring(0, 16));
    }
  }, [ticket?.deadline]);

  useEffect(() => {
    if (isAdmin) {
      getTags().then(res => setAllTags(res.data)).catch(() => {});
    }
  }, [isAdmin]);

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

  const handleDeadlineChange = async () => {
    try {
      const res = await updateDeadline(id, deadlineInput || null);
      setTicket(res.data);
      toast.success(deadlineInput ? 'Deadline set' : 'Deadline removed');
    } catch {
      toast.error('Failed to update deadline');
    }
  };

  // Note handler
  const handleAddNote = async () => {
    if (!noteBody.trim()) return;
    setNoteSaving(true);
    try {
      await addNote(id, noteBody);
      toast.success('Note added');
      setNoteBody('');
      setNoteOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to add note');
    } finally {
      setNoteSaving(false);
    }
  };

  // Tag handlers
  const handleAddTag = async (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = ticket.tags || [];
      if (currentTags.includes(tagInput.trim())) {
        setTagInput('');
        return;
      }
      try {
        const res = await updateTicketTags(id, [...currentTags, tagInput.trim()]);
        setTicket(res.data);
        setTagInput('');
        toast.success('Tag added');
      } catch {
        toast.error('Failed to add tag');
      }
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    const currentTags = ticket.tags || [];
    try {
      const res = await updateTicketTags(id, currentTags.filter(t => t !== tagToRemove));
      setTicket(res.data);
      toast.success('Tag removed');
    } catch {
      toast.error('Failed to remove tag');
    }
  };

  // Activity log handler
  const toggleActivityLog = async () => {
    if (!activityOpen && activityLog.length === 0) {
      setActivityLoading(true);
      try {
        const res = await getActivityLog(id);
        setActivityLog(res.data);
      } catch {
        toast.error('Failed to load activity log');
      } finally {
        setActivityLoading(false);
      }
    }
    setActivityOpen(!activityOpen);
  };

  // CSAT handler
  const handleCsatSubmit = async () => {
    if (csatRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setCsatSubmitting(true);
    try {
      await submitCsat(id, csatRating, csatComment);
      toast.success('Thank you for your feedback!');
      setCsatSubmitted(true);
    } catch {
      toast.error('Failed to submit feedback');
    } finally {
      setCsatSubmitting(false);
    }
  };

  const getTagColor = (tag) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
  };

  const isOverdue = ticket?.deadline && new Date(ticket.deadline) < new Date()
    && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED';

  if (loading) return <Spinner />;
  if (!ticket) return <div className="empty-state">Ticket not found</div>;

  const ticketTags = ticket.tags || [];

  return (
    <div className="ticket-detail-page animate-fade-in">
      <div className="ticket-detail-top-bar">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="top-bar-controls">
          <div className="status-select">
            <label>Status:</label>
            <select value={ticket.status} onChange={(e) => handleStatusChange(e.target.value)}>
              {STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          {isAdmin && (
            <div className="deadline-control">
              <label><FiClock /> Deadline:</label>
              <input
                type="datetime-local"
                value={deadlineInput}
                onChange={(e) => setDeadlineInput(e.target.value)}
              />
              <button className="btn btn-sm btn-primary" onClick={handleDeadlineChange}>Set</button>
              {ticket.deadline && (
                <button className="btn btn-sm btn-ghost" onClick={() => { setDeadlineInput(''); handleDeadlineChange(); }}>Clear</button>
              )}
            </div>
          )}
        </div>
      </div>

      {isOverdue && (
        <div className="overdue-banner animate-shake">
          <FiAlertTriangle /> This ticket is overdue! Deadline was {formatDate(ticket.deadline)}
          {ticket.reminderSent && <span className="reminder-sent-badge">Reminder sent</span>}
        </div>
      )}

      {!isOverdue && ticket.deadline && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
        <div className="deadline-banner">
          <FiClock /> Deadline: {formatDate(ticket.deadline)}
        </div>
      )}

      <TicketDetail ticket={ticket} />

      {/* Tags Section */}
      <div style={{ margin: '8px 0' }}>
        <div className="ticket-tags">
          {ticketTags.map(tag => (
            <span key={tag} className="tag-pill" style={{ backgroundColor: getTagColor(tag) }}>
              {tag}
              {isAdmin && (
                <span className="tag-remove" onClick={() => handleRemoveTag(tag)}><FiX size={12} /></span>
              )}
            </span>
          ))}
        </div>
        {isAdmin && (
          <div className="tag-input">
            <input
              type="text"
              placeholder="Add tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              list="tag-suggestions"
            />
            <datalist id="tag-suggestions">
              {allTags.filter(t => !ticketTags.includes(t.name)).map(t => (
                <option key={t.id} value={t.name} />
              ))}
            </datalist>
          </div>
        )}
      </div>

      <div className="ticket-actions">
        <button className="btn btn-primary" onClick={() => setReplyOpen(true)}>
          <FiCornerUpLeft /> Reply
        </button>
        <button className="btn btn-secondary" onClick={() => setNoteOpen(true)}>
          <FiFileText /> Add Note
        </button>
        <button className="btn btn-secondary" onClick={() => setForwardOpen(true)}>
          <FiShare /> Forward
        </button>
        {isAdmin && (
          <button className="btn btn-secondary" onClick={() => setAssignOpen(true)}>
            <FiUsers /> Assign to Agent
          </button>
        )}
        <button className="btn btn-secondary" onClick={() => setForwardAllOpen(true)}>
          <FiSend /> Forward All
        </button>
      </div>

      {replies.length > 0 && (
        <div className="ticket-replies">
          <h3>Replies, Forwards & Notes ({replies.length})</h3>
          {replies.map(reply => (
            <div key={reply.id} className={`reply-card ${reply.replyType === 'FORWARD' ? 'reply-forward' : ''} ${reply.replyType === 'NOTE' ? 'note-card' : ''}`}>
              <div className="reply-header">
                <span className="reply-type">
                  {reply.replyType}
                  {reply.replyType === 'NOTE' && <span className="note-badge" style={{ marginLeft: 8 }}>INTERNAL NOTE</span>}
                </span>
                <span className="reply-by">{reply.sentByAgentName}</span>
                <span className="reply-date">{formatDate(reply.sentDate)}</span>
              </div>
              {reply.replyType !== 'NOTE' && (
                <div className="reply-meta">
                  <span>To: {reply.toEmail}</span>
                </div>
              )}
              <div className="reply-body">{reply.body}</div>
            </div>
          ))}
        </div>
      )}

      {/* CSAT Survey Section */}
      {(ticket.status === 'RESOLVED') && !csatSubmitted && (
        <div className="csat-section">
          <h3>How satisfied are you with the resolution?</h3>
          <div className="csat-stars">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`csat-star ${star <= (csatHover || csatRating) ? 'active' : ''}`}
                onClick={() => setCsatRating(star)}
                onMouseEnter={() => setCsatHover(star)}
                onMouseLeave={() => setCsatHover(0)}
              >
                <FiStar fill={star <= (csatHover || csatRating) ? '#f39c12' : 'none'} />
              </span>
            ))}
          </div>
          <div className="csat-comment">
            <textarea
              placeholder="Any additional comments? (optional)"
              value={csatComment}
              onChange={(e) => setCsatComment(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleCsatSubmit} disabled={csatSubmitting}>
            {csatSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      )}

      {csatSubmitted && (
        <div className="csat-section">
          <h3>Thank you for your feedback!</h3>
          <p style={{ color: '#7f8c8d', marginTop: 8 }}>Your rating: {csatRating}/5</p>
        </div>
      )}

      {/* Activity Log Section */}
      <div className="activity-log">
        <h3 onClick={toggleActivityLog}>
          {activityOpen ? <FiChevronUp /> : <FiChevronDown />} Activity Log
        </h3>
        {activityOpen && (
          <div style={{ marginTop: 12 }}>
            {activityLoading ? (
              <Spinner />
            ) : activityLog.length === 0 ? (
              <p style={{ color: '#95a5a6', fontSize: '0.9rem' }}>No activity recorded</p>
            ) : (
              activityLog.map((entry, idx) => (
                <div key={idx} className="activity-entry">
                  <div className="activity-dot"></div>
                  <div>
                    <div className="activity-text">{entry.description || entry.action}</div>
                    <div className="activity-time">{formatDate(entry.timestamp || entry.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Note Modal */}
      <Modal isOpen={noteOpen} onClose={() => setNoteOpen(false)} title="Add Internal Note">
        <div className="note-modal-body">
          <textarea
            placeholder="Write an internal note..."
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
          />
        </div>
        <div className="modal-actions" style={{ marginTop: 12 }}>
          <button className="btn btn-secondary" onClick={() => setNoteOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAddNote} disabled={noteSaving || !noteBody.trim()}>
            {noteSaving ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </Modal>

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
