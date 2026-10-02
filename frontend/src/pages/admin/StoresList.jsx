import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import StarRating from '../../components/StarRating';
import './Admin.css';

const columns = [
  { key: 'name', label: 'Store Name' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address' },
  { key: 'rating', label: 'Rating', sortable: true },
];

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const navigate = useNavigate();

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const res = await api.get('/admin/stores', { params });
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

  const renderCell = (row, key) => {
    if (key === 'rating') {
      return (
        <div className="rating-display">
          <StarRating value={Math.round(row.averageRating || 0)} readonly size="sm" />
          <span className="rating-number">{row.averageRating ?? '—'}</span>
        </div>
      );
    }
    return row[key] || '—';
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Stores</h1>
          <p>Manage all registered stores</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/stores/add')} id="btn-add-store">
          + Add Store
        </button>
      </div>

      <form className="filter-bar" onSubmit={handleSearch} id="stores-filter">
        <input type="text" name="name" placeholder="Filter by name…" value={filters.name} onChange={handleFilterChange} />
        <input type="text" name="email" placeholder="Filter by email…" value={filters.email} onChange={handleFilterChange} />
        <input type="text" name="address" placeholder="Filter by address…" value={filters.address} onChange={handleFilterChange} />
        <button type="submit" className="btn-filter" id="btn-filter-stores">Search</button>
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
