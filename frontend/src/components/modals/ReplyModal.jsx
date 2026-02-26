import { useState } from 'react';
import Modal from '../common/Modal';
import { sendReply } from '../../services/replyService';
import { toast } from 'react-toastify';

export default function ReplyModal({ isOpen, onClose, ticket, onSuccess }) {
  const [toEmail, setToEmail] = useState(ticket?.fromEmail || '');
  const [subject, setSubject] = useState(`Re: ${ticket?.subject || ''}`);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendReply(ticket.id, { toEmail, subject, body });
      toast.success('Reply sent successfully!');
      setBody('');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reply to Email">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>To</label>
          <input type="email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} required placeholder="Type your reply..." />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
