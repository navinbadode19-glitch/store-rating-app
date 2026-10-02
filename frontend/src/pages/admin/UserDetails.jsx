import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';
import './Admin.css';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="page-content"><div className="loading-state">Loading…</div></div>;
  if (error) return <div className="page-content"><div className="auth-error">{error}</div></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>User Details</h1>
          <p>Viewing profile for {user.name}</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate(-1)} id="btn-back">
          ← Back
        </button>
      </div>

      <div className="detail-card" id="user-detail-card">
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Name</span>
            <span className="detail-value">{user.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Address</span>
            <span className="detail-value">{user.address || '—'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Role</span>
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
          </div>
        </div>

        {user.store && (
          <div className="store-section">
            <h3>Owner's Store</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Store Name</span>
                <span className="detail-value">{user.store.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Store Email</span>
                <span className="detail-value">{user.store.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Store Address</span>
                <span className="detail-value">{user.store.address || '—'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Average Rating</span>
                <div className="detail-value rating-display">
                  <StarRating value={Math.round(user.store.averageRating || 0)} readonly size="sm" />
                  <span className="rating-number">{user.store.averageRating ?? '—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
