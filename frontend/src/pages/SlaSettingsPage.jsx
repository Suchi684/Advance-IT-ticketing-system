import { useState, useEffect } from 'react';
import { getSlaPolices, updateSlaPolicy } from '../services/slaService';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';
import { FiSave } from 'react-icons/fi';

export default function SlaSettingsPage() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedRows, setEditedRows] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await getSlaPolices();
      setPolicies(res.data);
    } catch {
      toast.error('Failed to load SLA policies');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id, field, value) => {
    setEditedRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (policy) => {
    const edits = editedRows[policy.id];
    if (!edits) return;

    setSavingId(policy.id);
    try {
      const data = {
        responseHours: edits.responseHours !== undefined ? Number(edits.responseHours) : policy.responseHours,
        resolutionHours: edits.resolutionHours !== undefined ? Number(edits.resolutionHours) : policy.resolutionHours,
      };
      await updateSlaPolicy(policy.id, data);
      toast.success(`SLA policy for ${policy.priority} updated`);
      setEditedRows(prev => {
        const copy = { ...prev };
        delete copy[policy.id];
        return copy;
      });
      fetchPolicies();
    } catch {
      toast.error('Failed to update SLA policy');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="sla-settings-page animate-fade-in">
      <h2 style={{ marginBottom: 20 }}>SLA Settings</h2>

      {policies.length === 0 ? (
        <div className="empty-state"><p>No SLA policies found</p></div>
      ) : (
        <table className="sla-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Response Time (hours)</th>
              <th>Resolution Time (hours)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map(policy => {
              const edits = editedRows[policy.id] || {};
              return (
                <tr key={policy.id}>
                  <td style={{ fontWeight: 600 }}>{policy.priority}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={edits.responseHours !== undefined ? edits.responseHours : policy.responseHours}
                      onChange={(e) => handleChange(policy.id, 'responseHours', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={edits.resolutionHours !== undefined ? edits.resolutionHours : policy.resolutionHours}
                      onChange={(e) => handleChange(policy.id, 'resolutionHours', e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleSave(policy)}
                      disabled={!editedRows[policy.id] || savingId === policy.id}
                    >
                      <FiSave /> {savingId === policy.id ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
