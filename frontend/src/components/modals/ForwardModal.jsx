import { useState } from 'react';
import Modal from '../common/Modal';
import { forwardEmail } from '../../services/replyService';
import { toast } from 'react-toastify';

export default function ForwardModal({ isOpen, onClose, ticket, onSuccess }) {
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState(`Fwd: ${ticket?.subject || ''}`);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forwardEmail(ticket.id, { toEmail, subject, body });
      toast.success('Email forwarded successfully!');
      setToEmail('');
      setBody('');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error('Failed to forward email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Forward Email">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Forward To</label>
          <input type="email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} required placeholder="recipient@email.com" />
        </div>
        <div className="form-group">
          <label>Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Add a comment (optional)</label>
          <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add a note..." />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Forwarding...' : 'Forward'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
