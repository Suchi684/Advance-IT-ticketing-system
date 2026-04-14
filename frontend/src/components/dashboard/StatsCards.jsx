import { FiInbox, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Tickets', value: stats.totalTickets, icon: <FiInbox />, color: '#A0516B' },
    { label: 'Open', value: stats.openTickets, icon: <FiClock />, color: '#C75050' },
    { label: 'In Progress', value: stats.inProgressTickets, icon: <FiClock />, color: '#D4A0B0' },
    { label: 'Resolved', value: stats.resolvedTickets, icon: <FiCheckCircle />, color: '#6B3A5E' },
    { label: 'Closed', value: stats.closedTickets, icon: <FiXCircle />, color: '#8C8590' },
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
