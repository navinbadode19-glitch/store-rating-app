import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { validateName, validateEmail, validateAddress } from '../../utils/validation';
import './Admin.css';

export default function AddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = {};
    const nameErr = validateName(form.name);
    if (nameErr) errs.name = nameErr;
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    const addressErr = validateAddress(form.address);
    if (addressErr) errs.address = addressErr;
    if (!form.ownerId) errs.ownerId = 'Owner ID is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await api.post('/admin/stores', { ...form, ownerId: parseInt(form.ownerId, 10) });
      navigate('/admin/stores');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Add Store</h1>
          <p>Register a new store on the platform</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate(-1)} id="btn-back">
          ← Back
        </button>
      </div>

      <div className="form-card" id="add-store-form-card">
        <form onSubmit={handleSubmit} className="admin-form" id="add-store-form">
          {apiError && <div className="auth-error">{apiError}</div>}

          <div className="form-group">
            <label htmlFor="name">Store Name</label>
            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="20-60 characters" required />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Store Email</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="store@example.com" required />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address <span className="optional">(optional)</span></label>
            <input type="text" id="address" name="address" value={form.address} onChange={handleChange} placeholder="Max 400 characters" />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ownerId">Owner ID</label>
            <input type="number" id="ownerId" name="ownerId" value={form.ownerId} onChange={handleChange} placeholder="User ID of the owner" required />
            {errors.ownerId && <span className="field-error">{errors.ownerId}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading} id="btn-submit-store">
            {loading ? 'Creating…' : 'Create Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
