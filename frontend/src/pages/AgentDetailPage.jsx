import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgentPerformanceById } from '../services/dashboardService';
import Spinner from '../components/common/Spinner';
import { FiArrowLeft, FiAward, FiCheckCircle, FiClock, FiAlertCircle, FiClipboard } from 'react-icons/fi';

export default function AgentDetailPage() {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAgentPerformanceById(agentId);
        setAgent(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [agentId]);

  if (loading) return <Spinner />;
  if (!agent) return <div className="empty-state-card">Agent not found</div>;

  const rate = agent.totalAssigned > 0 ? Math.round((agent.resolved / agent.totalAssigned) * 100) : 0;

  return (
    <div className="agent-detail-page animate-fade-in">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/agents')}>
        <FiArrowLeft /> Back to Agents
      </button>

      <div className="agent-detail-hero animate-scale-in">
        <div className="agent-avatar-xl">{agent.agentName?.charAt(0)?.toUpperCase()}</div>
        <h2>{agent.agentName}</h2>
        <div className="agent-detail-credits">
          <FiAward /> <span>{agent.totalCredits}</span> Credits
        </div>
      </div>

      <div className="agent-detail-stats stagger-children">
        <div className="agent-stat-card">
          <FiClipboard className="stat-icon" />
          <div className="agent-stat-number">{agent.totalAssigned}</div>
          <div className="agent-stat-label">Total Assigned</div>
        </div>
        <div className="agent-stat-card resolved">
          <FiCheckCircle className="stat-icon" />
          <div className="agent-stat-number">{agent.resolved}</div>
          <div className="agent-stat-label">Resolved</div>
        </div>
        <div className="agent-stat-card in-progress">
          <FiClock className="stat-icon" />
          <div className="agent-stat-number">{agent.inProgress}</div>
          <div className="agent-stat-label">In Progress</div>
        </div>
        <div className="agent-stat-card open">
          <FiAlertCircle className="stat-icon" />
          <div className="agent-stat-number">{agent.open}</div>
          <div className="agent-stat-label">Open</div>
        </div>
      </div>

      <div className="completion-section animate-fade-in-up">
        <h3>Completion Rate</h3>
        <div className="completion-ring-wrapper">
          <svg className="completion-ring" viewBox="0 0 120 120">
            <circle className="ring-bg" cx="60" cy="60" r="52" />
            <circle className="ring-progress" cx="60" cy="60" r="52"
              style={{ strokeDasharray: `${rate * 3.267} 326.7` }} />
          </svg>
          <div className="completion-ring-text">{rate}%</div>
        </div>
      </div>
    </div>
  );
}
