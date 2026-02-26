import { useState } from 'react';
import Modal from '../common/Modal';
import { forwardAll } from '../../services/replyService';
import { toast } from 'react-toastify';

export default function ForwardAllModal({ isOpen, onClose, ticket, onSuccess }) {
  const [subject, setSubject] = useState(`Fwd: ${ticket?.subject || ''}`);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forwardAll(ticket.id, { subject, body });
      toast.success('Forwarded to all agents!');
      setBody('');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error('Failed to forward to all');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Forward to All Agents">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add a note for all agents..." />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Forward to All'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
