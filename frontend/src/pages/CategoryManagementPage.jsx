import { useState } from 'react';
import { useCategories } from '../context/CategoriesContext';
import { updateCategory } from '../services/categoryService';
import { toast } from 'react-toastify';
import { FiSettings, FiEdit2, FiX, FiCheck, FiAward } from 'react-icons/fi';

export default function CategoryManagementPage() {
  const { categories, refreshCategories } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', label: '', color: '#A0516B', baseCredits: 5 });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setForm({ name: '', label: '', color: '#A0516B', baseCredits: 5 });
    setEditingId(null);
  };

  const startEdit = (cat) => {
    setForm({ name: cat.name, label: cat.label, color: cat.color, baseCredits: cat.baseCredits });
    setEditingId(cat.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) {
      toast.error('Display label is required');
      return;
    }
    setLoading(true);
    try {
      await updateCategory(editingId, form);
      toast.success('Category updated');
      await refreshCategories();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-mgmt-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <FiSettings className="page-header-icon" />
          <div>
            <h2>Manage Categories</h2>
            <p className="page-header-sub">{categories.length} categories configured</p>
          </div>
        </div>
      </div>

      {editingId && (
        <div className="category-form-card animate-fade-in-up">
          <div className="category-form-header">
            <h3>Edit Category</h3>
            <button className="btn btn-ghost" onClick={resetForm}><FiX /></button>
          </div>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="category-form-row">
              <div className="form-group">
                <label>Name (key)</label>
                <input
                  type="text"
                  value={form.name}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Display Label</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. Warranty"
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                  />
                  <span>{form.color}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Base Credits</label>
                <input
                  type="number"
                  min="0"
                  value={form.baseCredits}
                  onChange={(e) => setForm({ ...form, baseCredits: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="category-form-actions">
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FiCheck /> Update
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="category-grid stagger-children">
        {categories.map(cat => (
          <div key={cat.id} className={`category-config-card ${editingId === cat.id ? 'editing' : ''}`}>
            <div className="category-config-header">
              <div className="category-config-color" style={{ backgroundColor: cat.color }}></div>
              <div>
                <h4>{cat.label}</h4>
                <span className="category-config-name">{cat.name}</span>
              </div>
              <span className="default-badge">System</span>
            </div>
            <div className="category-config-body">
              <div className="category-config-credits">
                <FiAward /> <span>{cat.baseCredits}</span> base credits
              </div>
            </div>
            <div className="category-config-actions">
              <button className="btn btn-sm btn-ghost" onClick={() => startEdit(cat)}>
                <FiEdit2 /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
