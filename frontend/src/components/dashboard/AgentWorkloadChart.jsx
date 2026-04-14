import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AgentWorkloadChart({ data }) {
  const chartData = data.map(agent => ({
    name: agent.agentName,
    tickets: agent.ticketCount,
  }));

  return (
    <div className="chart-container">
      <h3>Agent Workload</h3>
      {chartData.length === 0 ? (
        <p className="no-data">No assignments yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E1E6" />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 12, fill: '#7A7480' }}
              height={60}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#7A7480' }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #E5E1E6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Bar dataKey="tickets" fill="#A0516B" name="Assigned Tickets" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
