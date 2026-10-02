import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', gradient: 'gradient-blue' },
    { label: 'Total Stores', value: stats.totalStores, icon: '🏪', gradient: 'gradient-purple' },
    { label: 'Total Ratings', value: stats.totalRatings, icon: '⭐', gradient: 'gradient-gold' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of the platform</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : (
        <div className="stats-grid" id="dashboard-stats">
          {cards.map((card) => (
            <div key={card.label} className={`stat-card ${card.gradient}`} id={`stat-${card.label.toLowerCase().replace(' ', '-')}`}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{card.value}</span>
                <span className="stat-label">{card.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
