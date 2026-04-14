import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAgentPerformance } from '../services/dashboardService';
import Spinner from '../components/common/Spinner';
import { FiUsers, FiAward, FiChevronRight, FiTrendingUp } from 'react-icons/fi';

export default function AgentPerformancePage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAgentPerformance();
        setAgents(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner />;

  const totalCredits = agents.reduce((sum, a) => sum + a.totalCredits, 0);
  const totalResolved = agents.reduce((sum, a) => sum + a.resolved, 0);

  return (
    <div className="agent-performance-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <FiUsers className="page-header-icon" />
          <div>
            <h2>Agent Performance</h2>
            <p className="page-header-sub">{agents.length} agents</p>
          </div>
        </div>
      </div>

      <div className="perf-summary-row stagger-children">
        <div className="perf-summary-card">
          <FiUsers />
          <div className="perf-summary-value">{agents.length}</div>
          <div className="perf-summary-label">Active Agents</div>
        </div>
        <div className="perf-summary-card">
          <FiTrendingUp />
          <div className="perf-summary-value">{totalResolved}</div>
          <div className="perf-summary-label">Total Resolved</div>
        </div>
        <div className="perf-summary-card">
          <FiAward />
          <div className="perf-summary-value">{totalCredits}</div>
          <div className="perf-summary-label">Total Credits</div>
        </div>
      </div>

      <div className="agent-cards-grid stagger-children">
        {agents.map(agent => {
          const rate = agent.totalAssigned > 0 ? Math.round((agent.resolved / agent.totalAssigned) * 100) : 0;
          return (
            <div key={agent.agentId} className="agent-perf-card" onClick={() => navigate(`/agents/${agent.agentId}`)}>
              <div className="agent-perf-header">
                <div className="agent-avatar-lg">{agent.agentName?.charAt(0)?.toUpperCase()}</div>
                <div>
                  <h4>{agent.agentName}</h4>
                  <span className="agent-perf-subtitle">{agent.totalAssigned} tickets assigned</span>
                </div>
                <FiChevronRight className="agent-perf-arrow" />
              </div>
              <div className="agent-perf-stats">
                <div className="agent-perf-stat">
                  <span className="agent-perf-stat-value">{agent.resolved}</span>
                  <span className="agent-perf-stat-label">Resolved</span>
                </div>
                <div className="agent-perf-stat">
                  <span className="agent-perf-stat-value credit-value"><FiAward /> {agent.totalCredits}</span>
                  <span className="agent-perf-stat-label">Credits</span>
                </div>
                <div className="agent-perf-stat">
                  <div className="mini-progress-wrapper">
                    <div className="mini-progress" style={{ width: `${rate}%` }}></div>
                  </div>
                  <span className="agent-perf-stat-label">{rate}% Complete</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
