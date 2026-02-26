import { useState, useEffect } from 'react';
import { getStats, getAgentWorkload } from '../services/dashboardService';
import StatsCards from '../components/dashboard/StatsCards';
import CategoryChart from '../components/dashboard/CategoryChart';
import AgentWorkloadChart from '../components/dashboard/AgentWorkloadChart';
import Spinner from '../components/common/Spinner';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, workloadRes] = await Promise.all([
        getStats(),
        getAgentWorkload(),
      ]);
      setStats(statsRes.data);
      setWorkload(workloadRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      {stats && (
        <>
          <StatsCards stats={stats} />
          <div className="charts-row">
            <CategoryChart data={stats.ticketsByCategory || {}} />
            <AgentWorkloadChart data={workload} />
          </div>
        </>
      )}
    </div>
  );
}
