import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CATEGORIES, getCategoryColor } from '../../utils/constants';

export default function CategoryChart({ data }) {
  const chartData = CATEGORIES.map(cat => ({
    name: cat.label,
    value: data[cat.value] || 0,
    color: cat.color,
  }));

  return (
    <div className="chart-container">
      <h3>Tickets by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" name="Tickets">
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
