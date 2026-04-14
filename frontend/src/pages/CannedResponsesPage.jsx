import { useState, useEffect } from 'react';
import { getCannedResponses, createCannedResponse, updateCannedResponse, deleteCannedResponse } from '../services/cannedResponseService';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function CannedResponsesPage() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', category: '' });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await getCannedResponses();
      setResponses(res.data);
    } catch {
      toast.error('Failed to load canned responses');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', body: '', category: '' });
    setModalOpen(true);
  };

  const openEdit = (resp) => {
    setEditing(resp);
    setForm({ title: resp.title, body: resp.body, category: resp.category || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateCannedResponse(editing.id, form);
        toast.success('Canned response updated');
      } else {
        await createCannedResponse(form);
        toast.success('Canned response created');
      }
      setModalOpen(false);
      fetchResponses();
    } catch {
      toast.error('Failed to save canned response');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCannedResponse(deleteId);
      toast.success('Canned response deleted');
      setDeleteId(null);
      fetchResponses();
    } catch {
      toast.error('Failed to delete canned response');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="canned-responses-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Canned Responses</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <FiPlus /> New Response
        </button>
      </div>

      {responses.length === 0 ? (
        <div className="empty-state"><p>No canned responses yet</p></div>
      ) : (
        <div className="canned-grid">
          {responses.map(resp => (
            <div key={resp.id} className="canned-card">
              {resp.category && <span className="canned-card-category">{resp.category}</span>}
              <h4>{resp.title}</h4>
              <div className="canned-card-body">{resp.body}</div>
              <div className="canned-card-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => openEdit(resp)}>
                  <FiEdit2 /> Edit
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(resp.id)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Canned Response' : 'New Canned Response'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Billing, Support" />
          </div>
          <div className="form-group">
            <label>Body</label>
            <textarea rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required placeholder="Response template text..." />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p>Are you sure you want to delete this canned response?</p>
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-primary" style={{ background: '#e74c3c' }} onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
