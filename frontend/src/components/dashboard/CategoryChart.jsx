import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useCategories } from '../../context/CategoriesContext';

export default function CategoryChart({ data }) {
  const { categories } = useCategories();

  const chartData = (categories || []).map(cat => ({
    name: cat.label || cat.name,
    value: data[cat.name] || 0,
    color: cat.color || '#8C8590',
  }));

  return (
    <div className="chart-container">
      <h3>Tickets by Category</h3>
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
          <Bar dataKey="value" name="Tickets" radius={[4, 4, 0, 0]} barSize={40}>
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
