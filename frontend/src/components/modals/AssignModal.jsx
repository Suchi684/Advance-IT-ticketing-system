import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { getAgents } from '../../services/userService';
import { assignTicket } from '../../services/ticketService';
import { toast } from 'react-toastify';

export default function AssignModal({ isOpen, onClose, ticket, onSuccess }) {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getAgents().then(res => setAgents(res.data)).catch(() => toast.error('Failed to load agents'));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgent) {
      toast.error('Please select an agent');
      return;
    }
    setLoading(true);
    try {
      await assignTicket(ticket.id, parseInt(selectedAgent));
      toast.success('Ticket assigned successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error('Failed to assign ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign to Agent">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Agent</label>
          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} required>
            <option value="">Choose an agent...</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name} ({agent.email})</option>
            ))}
          </select>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
