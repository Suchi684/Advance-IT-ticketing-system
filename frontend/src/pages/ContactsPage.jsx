import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContactsWithSummary, createContact } from '../services/contactService';
import { useCategories } from '../context/CategoriesContext';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch, FiLayers } from 'react-icons/fi';

export default function ContactsPage() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [filterMulti, setFilterMulti] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [page]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = { page, size: 20 };
      const res = await getContactsWithSummary(params);
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

  const getCategoryColor = (name) => {
    const cat = (categories || []).find(c => c.name === name);
    return cat?.color || '#95a5a6';
  };

  const getCategoryLabel = (name) => {
    const cat = (categories || []).find(c => c.name === name);
    return cat?.label || name;
  };

  const matchesSearch = (c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q)
    );
  };

  const visibleContacts = contacts
    .filter(matchesSearch)
    .filter(c => !filterMulti || (c.categories || []).length >= 2);

  return (
    <div className="contacts-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Contacts</h2>
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
          <FiPlus /> New Contact
        </button>
      </div>

      <div className="filter-bar" style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-box" style={{ position: 'relative', maxWidth: 320, flex: '1 1 240px' }}>
          <FiSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#95a5a6' }} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 34, width: '100%', padding: '8px 12px 8px 34px', border: '1px solid #dfe6e9', borderRadius: 8, fontSize: '0.9rem' }}
          />
        </div>
        <label className={`multi-cat-toggle ${filterMulti ? 'active' : ''}`}>
          <input
            type="checkbox"
            checked={filterMulti}
            onChange={(e) => setFilterMulti(e.target.checked)}
          />
          <FiLayers /> Multi-category only
        </label>
      </div>

      {loading ? (
        <Spinner />
      ) : visibleContacts.length === 0 ? (
        <div className="empty-state"><p>No contacts found</p></div>
      ) : (
        <>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Tickets</th>
                <th>Categories</th>
              </tr>
            </thead>
            <tbody>
              {visibleContacts.map(contact => {
                const cats = contact.categories || [];
                const isMulti = cats.length >= 2;
                return (
                  <tr key={contact.id} onClick={() => navigate(`/contacts/${contact.id}`)}>
                    <td>
                      {contact.name}
                      {isMulti && (
                        <span className="multi-cat-badge" title={`Wrote about ${cats.length} different categories`}>
                          <FiLayers /> {cats.length}
                        </span>
                      )}
                    </td>
                    <td>{contact.email}</td>
                    <td>{contact.company || '-'}</td>
                    <td>{contact.totalTickets || 0}</td>
                    <td>
                      {cats.length === 0 ? (
                        <span style={{ color: '#b5aebb', fontSize: '0.85rem' }}>—</span>
                      ) : (
                        <div className="cat-chip-group">
                          {cats.map(c => (
                            <span
                              key={c.category}
                              className="cat-chip"
                              style={{ background: getCategoryColor(c.category) + '22', color: getCategoryColor(c.category), borderColor: getCategoryColor(c.category) + '55' }}
                              title={`${getCategoryLabel(c.category)}: ${c.count} ticket${c.count === 1 ? '' : 's'}`}
                            >
                              <span className="cat-dot" style={{ background: getCategoryColor(c.category) }}></span>
                              {getCategoryLabel(c.category)} · {c.count}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
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
