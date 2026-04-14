import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContacts, createContact } from '../services/contactService';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch } from 'react-icons/fi';

export default function ContactsPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [page, search]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = { page, size: 20 };
      if (search) params.search = search;
      const res = await getContacts(params);
      setContacts(res.data.content || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createContact(form);
      toast.success('Contact created');
      setCreateOpen(false);
      setForm({ name: '', email: '', phone: '', company: '', notes: '' });
      fetchContacts();
    } catch {
      toast.error('Failed to create contact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="contacts-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Contacts</h2>
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
          <FiPlus /> New Contact
        </button>
      </div>

      <div className="filter-bar" style={{ marginBottom: 16 }}>
        <div className="search-box" style={{ position: 'relative', maxWidth: 320 }}>
          <FiSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#95a5a6' }} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            style={{ paddingLeft: 34, width: '100%', padding: '8px 12px 8px 34px', border: '1px solid #dfe6e9', borderRadius: 8, fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : contacts.length === 0 ? (
        <div className="empty-state"><p>No contacts found</p></div>
      ) : (
        <>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} onClick={() => navigate(`/contacts/${contact.id}`)}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone || '-'}</td>
                  <td>{contact.company || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: 16 }}>
              <button className="btn btn-secondary" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
              <span>Page {page + 1} of {totalPages}</span>
              <button className="btn btn-secondary" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New Contact">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating...' : 'Create Contact'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
