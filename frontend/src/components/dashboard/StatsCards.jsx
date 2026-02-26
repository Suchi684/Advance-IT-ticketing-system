import { FiInbox, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Tickets', value: stats.totalTickets, icon: <FiInbox />, color: '#3498db' },
    { label: 'Open', value: stats.openTickets, icon: <FiClock />, color: '#e74c3c' },
    { label: 'In Progress', value: stats.inProgressTickets, icon: <FiClock />, color: '#f39c12' },
    { label: 'Resolved', value: stats.resolvedTickets, icon: <FiCheckCircle />, color: '#27ae60' },
    { label: 'Closed', value: stats.closedTickets, icon: <FiXCircle />, color: '#95a5a6' },
  ];

  return (
    <div className="stats-cards">
      {cards.map(card => (
        <div key={card.label} className="stat-card" style={{ borderTop: `4px solid ${card.color}` }}>
          <div className="stat-icon" style={{ color: card.color }}>{card.icon}</div>
          <div className="stat-info">
            <h3>{card.value}</h3>
            <p>{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
