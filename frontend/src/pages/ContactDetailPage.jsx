import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContactById, getContactTickets, updateContact, deleteContact } from '../services/contactService';
import Spinner from '../components/common/Spinner';
import Badge from '../components/common/Badge';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/dateFormatter';
import { getStatusColor, getStatusLabel } from '../utils/constants';
import { FiArrowLeft, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

export default function ContactDetailPage() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetchData();
  }, [contactId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contactRes, ticketsRes] = await Promise.all([
        getContactById(contactId),
        getContactTickets(contactId),
      ]);
      setContact(contactRes.data);
      setTickets(ticketsRes.data.content || ticketsRes.data);
      setForm({
        name: contactRes.data.name || '',
        email: contactRes.data.email || '',
        phone: contactRes.data.phone || '',
        company: contactRes.data.company || '',
        notes: contactRes.data.notes || '',
      });
    } catch {
      toast.error('Failed to load contact');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateContact(contactId, form);
      setContact(res.data);
      setEditing(false);
      toast.success('Contact updated');
    } catch {
      toast.error('Failed to update contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContact(contactId);
      toast.success('Contact deleted');
      navigate('/contacts');
    } catch {
      toast.error('Failed to delete contact');
    }
  };

  if (loading) return <Spinner />;
  if (!contact) return <div className="empty-state">Contact not found</div>;

  return (
    <div className="contact-detail-page animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/contacts')}>
          <FiArrowLeft /> Back to Contacts
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {!editing ? (
            <>
              <button className="btn btn-secondary" onClick={() => setEditing(true)}><FiEdit2 /> Edit</button>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(true)}><FiTrash2 /> Delete</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}><FiSave /> {saving ? 'Saving...' : 'Save'}</button>
              <button className="btn btn-secondary" onClick={() => { setEditing(false); setForm({ name: contact.name || '', email: contact.email || '', phone: contact.phone || '', company: contact.company || '', notes: contact.notes || '' }); }}><FiX /> Cancel</button>
            </>
          )}
        </div>
      </div>

      {confirmDelete && (
        <div style={{ background: '#fef9e7', padding: 16, borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>Are you sure you want to delete this contact?</span>
          <button className="btn btn-sm btn-primary" style={{ background: '#e74c3c' }} onClick={handleDelete}>Yes, Delete</button>
          <button className="btn btn-sm btn-secondary" onClick={() => setConfirmDelete(false)}>Cancel</button>
        </div>
      )}

      <div className="contact-detail-card">
        <h3 style={{ marginBottom: 16 }}>{editing ? 'Edit Contact' : 'Contact Information'}</h3>
        {editing ? (
          <div className="contact-info-grid">
            <div className="contact-info-item">
              <label>Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #dfe6e9', borderRadius: 6, marginTop: 4 }} />
            </div>
            <div className="contact-info-item">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #dfe6e9', borderRadius: 6, marginTop: 4 }} />
            </div>
            <div className="contact-info-item">
              <label>Phone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #dfe6e9', borderRadius: 6, marginTop: 4 }} />
            </div>
            <div className="contact-info-item">
              <label>Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #dfe6e9', borderRadius: 6, marginTop: 4 }} />
            </div>
            <div className="contact-info-item" style={{ gridColumn: '1 / -1' }}>
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} style={{ width: '100%', padding: '8px 12px', border: '1px solid #dfe6e9', borderRadius: 6, marginTop: 4, resize: 'vertical' }} />
            </div>
          </div>
        ) : (
          <div className="contact-info-grid">
            <div className="contact-info-item">
              <label>Name</label>
              <p>{contact.name}</p>
            </div>
            <div className="contact-info-item">
              <label>Email</label>
              <p>{contact.email}</p>
            </div>
            <div className="contact-info-item">
              <label>Phone</label>
              <p>{contact.phone || '-'}</p>
            </div>
            <div className="contact-info-item">
              <label>Company</label>
              <p>{contact.company || '-'}</p>
            </div>
            {contact.notes && (
              <div className="contact-info-item" style={{ gridColumn: '1 / -1' }}>
                <label>Notes</label>
                <p>{contact.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Tickets ({tickets.length})</h3>
        {tickets.length === 0 ? (
          <div className="empty-state"><p>No tickets for this contact</p></div>
        ) : (
          <table className="contacts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} onClick={() => navigate(`/tickets/${t.id}`)}>
                  <td>#{t.id}</td>
                  <td>{t.subject || '(No Subject)'}</td>
                  <td><Badge label={getStatusLabel(t.status)} color={getStatusColor(t.status)} /></td>
                  <td>{formatDate(t.receivedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
