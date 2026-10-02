import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { validateForm } from '../../utils/validation';
import './Admin.css';

export default function AddUser() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setApiError('');
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post('/admin/users', form);
      navigate('/admin/users');
    } catch (err) {
      const fieldErrors = err.response?.data?.errors;
      setApiError(fieldErrors ? fieldErrors.join(', ') : err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Add User</h1>
          <p>Create a new user, admin, or store owner</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate(-1)} id="btn-back">
          ← Back
        </button>
      </div>

      <div className="form-card" id="add-user-form-card">
        <form onSubmit={handleSubmit} className="admin-form" id="add-user-form">
          {apiError && <div className="auth-error">{apiError}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="20-60 characters" required />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="user@example.com" required />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} placeholder="8-16 chars, 1 uppercase, 1 special" required />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address <span className="optional">(optional)</span></label>
            <input type="text" id="address" name="address" value={form.address} onChange={handleChange} placeholder="Max 400 characters" />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} id="btn-submit-user">
            {loading ? 'Creating…' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
}
