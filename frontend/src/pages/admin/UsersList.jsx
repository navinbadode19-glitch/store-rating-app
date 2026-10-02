import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import './Admin.css';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address' },
  { key: 'role', label: 'Role' },
];

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const res = await api.get('/admin/users', { params });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, order]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const renderCell = (row, key) => {
    if (key === 'role') {
      return <span className={`role-badge role-${row.role}`}>{row.role}</span>;
    }
    return row[key] || '—';
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>Manage all platform users</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/users/add')} id="btn-add-user">
          + Add User
        </button>
      </div>

      <form className="filter-bar" onSubmit={handleSearch} id="users-filter">
        <input type="text" name="name" placeholder="Filter by name…" value={filters.name} onChange={handleFilterChange} />
        <input type="text" name="email" placeholder="Filter by email…" value={filters.email} onChange={handleFilterChange} />
        <input type="text" name="address" placeholder="Filter by address…" value={filters.address} onChange={handleFilterChange} />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
        <button type="submit" className="btn-filter" id="btn-filter-users">Search</button>
      </form>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          sortBy={sortBy}
          order={order}
          onSort={(s, o) => { setSortBy(s); setOrder(o); }}
          renderCell={renderCell}
          onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
        />
      )}
    </div>
  );
}
