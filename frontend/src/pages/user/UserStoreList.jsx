import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import StarRating from '../../components/StarRating';
import '../admin/Admin.css';
import './User.css';

const columns = [
  { key: 'name', label: 'Store Name' },
  { key: 'address', label: 'Address' },
  { key: 'rating', label: 'Overall Rating', sortable: true },
  { key: 'myRating', label: 'My Rating', sortable: false },
];

export default function UserStoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [submitting, setSubmitting] = useState(null); // id of the store being rated

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const res = await api.get('/stores', { params });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortBy, order]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRate = async (storeId, rating) => {
    setSubmitting(storeId);
    try {
      const store = stores.find((s) => s.id === storeId);
      if (store.myRating) {
        await api.put(`/stores/${storeId}/rating`, { rating });
      } else {
        await api.post(`/stores/${storeId}/rating`, { rating });
      }
      await fetchStores();
    } catch (err) {
      console.error('Failed to submit rating:', err);
    } finally {
      setSubmitting(null);
    }
  };

  const renderCell = (row, key) => {
    if (key === 'rating') {
      return (
        <div className="rating-display">
          <StarRating value={Math.round(row.overallRating || 0)} readonly size="sm" />
          <span className="rating-number">{row.overallRating ?? '—'}</span>
        </div>
      );
    }
    if (key === 'myRating') {
      return (
        <div className="my-rating-cell">
          <StarRating
            value={row.myRating || 0}
            onChange={(r) => handleRate(row.id, r)}
            size="sm"
          />
          {row.myRating && <span className="rating-badge">Rated</span>}
          {submitting === row.id && <span className="saving-indicator">Saving…</span>}
        </div>
      );
    }
    return row[key] || '—';
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Browse Stores</h1>
          <p>Rate and review stores</p>
        </div>
      </div>

      <form className="filter-bar" onSubmit={handleSearch} id="user-stores-filter">
        <input type="text" name="name" placeholder="Search by store name…" value={filters.name} onChange={handleFilterChange} />
        <input type="text" name="address" placeholder="Search by address…" value={filters.address} onChange={handleFilterChange} />
        <button type="submit" className="btn-filter" id="btn-search-stores">Search</button>
      </form>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : (
        <DataTable
          columns={columns}
          data={stores}
          sortBy={sortBy}
          order={order}
          onSort={(s, o) => { setSortBy(s); setOrder(o); }}
          renderCell={renderCell}
        />
      )}
    </div>
  );
}
