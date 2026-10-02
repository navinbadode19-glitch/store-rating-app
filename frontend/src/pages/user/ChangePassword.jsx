import { useState } from 'react';
import api from '../../api/axios';
import { validatePassword } from '../../utils/validation';
import '../auth/Auth.css';
import '../admin/Admin.css';

const emptyForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function ChangePassword() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setApiError('');
    setSuccess('');
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';

    const passwordErr = validatePassword(form.newPassword);
    if (passwordErr) errs.newPassword = passwordErr;

    if (form.newPassword !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(res.data.message);
      setForm(emptyForm);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Change Password</h1>
          <p>Update your account password</p>
        </div>
      </div>

      <div className="form-card" id="change-password-card" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit} className="admin-form" id="change-password-form">
          {apiError && <div className="auth-error">{apiError}</div>}
          {success && <div className="success-msg">{success}</div>}

          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
            />
            {errors.currentPassword && <span className="field-error">{errors.currentPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="8-16 chars, 1 uppercase, 1 special"
              required
            />
            {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              required
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading} id="btn-change-password">
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
