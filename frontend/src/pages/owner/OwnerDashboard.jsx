import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import StarRating from '../../components/StarRating';
import '../admin/Admin.css';
import './Owner.css';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'rating', label: 'Rating', sortable: false },
];

const renderCell = (row, key) => {
  if (key === 'rating') {
    return (
      <div className="rating-display">
        <StarRating value={row.rating} readonly size="sm" />
        <span className="rating-number">{row.rating}</span>
      </div>
    );
  }
  return row[key] || '—';
};

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/owner/store');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="page-content"><div className="loading-state">Loading…</div></div>;
  if (error) return <div className="page-content"><div className="auth-error">{error}</div></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Store Dashboard</h1>
          <p>{data.store.name}</p>
        </div>
      </div>

      <div className="owner-overview" id="owner-overview">
        <div className="owner-store-card">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Store Name</span>
              <span className="detail-value">{data.store.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{data.store.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Address</span>
              <span className="detail-value">{data.store.address || '—'}</span>
            </div>
          </div>
        </div>

        <div className="avg-rating-card">
          <span className="avg-label">Average Rating</span>
          <div className="avg-value-row">
            <StarRating value={Math.round(data.averageRating || 0)} readonly size="lg" />
            <span className="avg-number">{data.averageRating ?? '—'}</span>
          </div>
          <span className="avg-count">{data.raters.length} rating{data.raters.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="raters-section">
        <h2>Recent Ratings</h2>
        <DataTable
          columns={columns}
          data={data.raters}
          renderCell={renderCell}
        />
      </div>
    </div>
  );
}
