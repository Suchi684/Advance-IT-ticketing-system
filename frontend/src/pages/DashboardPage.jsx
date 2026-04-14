import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStats, getAgentWorkload, getAgentPerformance, getMyPerformance } from '../services/dashboardService';
import { getAssignedTickets } from '../services/ticketService';
import StatsCards from '../components/dashboard/StatsCards';
import CategoryChart from '../components/dashboard/CategoryChart';
import AgentWorkloadChart from '../components/dashboard/AgentWorkloadChart';
import Spinner from '../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiCheckCircle, FiClock, FiAlertCircle, FiClipboard, FiTrendingUp, FiChevronRight } from 'react-icons/fi';

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return isAdmin ? <AdminDashboard /> : <AgentDashboard />;
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [workload, setWorkload] = useState([]);
  const [agentPerf, setAgentPerf] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, workloadRes, perfRes] = await Promise.all([
          getStats(), getAgentWorkload(), getAgentPerformance()
        ]);
        setStats(statsRes.data);
        setWorkload(workloadRes.data);
        setAgentPerf(perfRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="dashboard-page animate-fade-in">
      <h2>Admin Dashboard</h2>
      {stats && (
        <>
          <StatsCards stats={stats} />
          <div className="charts-row">
            <CategoryChart data={stats.ticketsByCategory || {}} />
            <AgentWorkloadChart data={workload} />
          </div>
        </>
      )}
      {agentPerf.length > 0 && (
        <div className="agent-performance-section animate-fade-in-up">
          <h3><FiTrendingUp /> Agent Performance</h3>
          <div className="performance-table-wrapper">
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Assigned</th>
                  <th>Resolved</th>
                  <th>Credits</th>
                  <th>Completion</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {agentPerf.map((agent, i) => {
                  const rate = agent.totalAssigned > 0 ? Math.round((agent.resolved / agent.totalAssigned) * 100) : 0;
                  return (
                    <tr key={agent.agentId} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <td className="agent-name-cell">
                        <div className="agent-avatar">{agent.agentName?.charAt(0)?.toUpperCase()}</div>
                        {agent.agentName}
                      </td>
                      <td>{agent.totalAssigned}</td>
                      <td>{agent.resolved}</td>
                      <td><span className="credit-badge"><FiAward /> {agent.totalCredits}</span></td>
                      <td>
                        <div className="progress-bar-wrapper">
                          <div className="progress-bar" style={{ width: `${rate}%` }}></div>
                          <span className="progress-label">{rate}%</span>
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/agents/${agent.agentId}`)}>
                          <FiChevronRight />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AgentDashboard() {
  const { user } = useAuth();
  const [perf, setPerf] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [perfRes, ticketsRes] = await Promise.all([
          getMyPerformance(),
          getAssignedTickets({ page: 0, size: 5 })
        ]);
        setPerf(perfRes.data);
        setRecentTickets(ticketsRes.data.content);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="dashboard-page animate-fade-in">
      <h2>Welcome back, {user?.name}</h2>

      {perf && (
        <>
          <div className="agent-credit-hero animate-scale-in">
            <div className="credit-hero-icon"><FiAward /></div>
            <div className="credit-hero-score">{perf.totalCredits}</div>
            <div className="credit-hero-label">Total Credits Earned</div>
          </div>

          <div className="agent-stats-row stagger-children">
            <div className="agent-stat-card">
              <FiClipboard className="stat-icon" />
              <div className="agent-stat-number">{perf.totalAssigned}</div>
              <div className="agent-stat-label">Total Assigned</div>
            </div>
            <div className="agent-stat-card resolved">
              <FiCheckCircle className="stat-icon" />
              <div className="agent-stat-number">{perf.resolved}</div>
              <div className="agent-stat-label">Resolved</div>
            </div>
            <div className="agent-stat-card in-progress">
              <FiClock className="stat-icon" />
              <div className="agent-stat-number">{perf.inProgress}</div>
              <div className="agent-stat-label">In Progress</div>
            </div>
            <div className="agent-stat-card open">
              <FiAlertCircle className="stat-icon" />
              <div className="agent-stat-number">{perf.open}</div>
              <div className="agent-stat-label">Open</div>
            </div>
          </div>
        </>
      )}

      {recentTickets.length > 0 && (
        <div className="recent-tasks-section animate-fade-in-up">
          <div className="section-header">
            <h3>Recent Tasks</h3>
            <button className="btn btn-link" onClick={() => navigate('/assigned')}>View All <FiChevronRight /></button>
          </div>
          <div className="recent-tasks-list">
            {recentTickets.map((ticket, i) => (
              <div key={ticket.id} className="recent-task-item" style={{ animationDelay: `${i * 0.05}s` }}
                   onClick={() => navigate(`/tickets/${ticket.id}`)}>
                <div className="recent-task-info">
                  <span className="recent-task-id">#{ticket.id}</span>
                  <span className="recent-task-subject">{ticket.subject}</span>
                </div>
                <div className="recent-task-meta">
                  <span className={`status-dot status-${ticket.status?.toLowerCase()}`}></span>
                  <span className="recent-task-credits"><FiAward /> {ticket.credits || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
