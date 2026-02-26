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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="tickets" fill="#3498db" name="Assigned Tickets" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
