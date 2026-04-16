import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgentPerformanceById, getAgentContacts } from '../services/dashboardService';
import Spinner from '../components/common/Spinner';
import { FiArrowLeft, FiAward, FiCheckCircle, FiClock, FiAlertCircle, FiClipboard, FiUsers, FiBook, FiMail } from 'react-icons/fi';

export default function AgentDetailPage() {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [perf, contactsRes] = await Promise.all([
          getAgentPerformanceById(agentId),
          getAgentContacts(agentId),
        ]);
        setAgent(perf.data);
        setContacts(contactsRes.data || []);
      } catch (err) { console.error(err); }
      finally {
        setLoading(false);
        setContactsLoading(false);
      }
    })();
  }, [agentId]);

  if (loading) return <Spinner />;
  if (!agent) return <div className="empty-state-card">Agent not found</div>;

  const rate = agent.totalAssigned > 0 ? Math.round((agent.resolved / agent.totalAssigned) * 100) : 0;
  const uniqueContactCount = contacts.length;

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

      <div className="agent-contacts-section animate-fade-in-up">
        <div className="agent-contacts-header">
          <h3><FiUsers /> Contacts Handled</h3>
          <span className="agent-contacts-count">{uniqueContactCount} {uniqueContactCount === 1 ? 'contact' : 'contacts'}</span>
        </div>
        {contactsLoading ? (
          <Spinner />
        ) : contacts.length === 0 ? (
          <div className="empty-state"><p>No contacts yet — this agent has no assigned tickets.</p></div>
        ) : (
          <div className="agent-contacts-grid">
            {contacts.map(c => {
              const resolveRate = c.ticketCount > 0 ? Math.round((c.resolvedCount / c.ticketCount) * 100) : 0;
              const clickable = !!c.contactId;
              return (
                <div
                  key={c.email}
                  className={`agent-contact-card ${clickable ? 'clickable' : ''}`}
                  onClick={() => clickable && navigate(`/contacts/${c.contactId}`)}
                >
                  <div className="agent-contact-avatar">
                    {(c.name || c.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="agent-contact-info">
                    <div className="agent-contact-name">
                      {c.name || <span className="agent-contact-unknown">Unknown contact</span>}
                    </div>
                    <div className="agent-contact-email">
                      <FiMail /> {c.email}
                    </div>
                    {c.company && (
                      <div className="agent-contact-company">
                        <FiBook /> {c.company}
                      </div>
                    )}
                    <div className="agent-contact-stats">
                      <span className="agent-contact-stat">
                        <strong>{c.ticketCount}</strong> ticket{c.ticketCount === 1 ? '' : 's'}
                      </span>
                      <span className="agent-contact-stat resolved-stat">
                        <FiCheckCircle /> {c.resolvedCount} resolved
                      </span>
                      <span className="agent-contact-rate">{resolveRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
