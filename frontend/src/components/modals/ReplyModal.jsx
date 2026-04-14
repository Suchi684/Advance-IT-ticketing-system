import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { sendReply } from '../../services/replyService';
import { getCannedResponses } from '../../services/cannedResponseService';
import { toast } from 'react-toastify';

export default function ReplyModal({ isOpen, onClose, ticket, onSuccess }) {
  const [toEmail, setToEmail] = useState(ticket?.fromEmail || '');
  const [subject, setSubject] = useState(`Re: ${ticket?.subject || ''}`);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    if (isOpen) {
      getCannedResponses()
        .then(res => setTemplates(res.data))
        .catch(() => {});
    }
  }, [isOpen]);

  const handleTemplateSelect = (e) => {
    const templateId = e.target.value;
    if (!templateId) return;
    const template = templates.find(t => String(t.id) === templateId);
    if (template) {
      setBody(template.body);
    }
  };

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
        {templates.length > 0 && (
          <div className="template-picker">
            <select onChange={handleTemplateSelect} defaultValue="">
              <option value="">Use Template...</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title}{t.category ? ` (${t.category})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
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
