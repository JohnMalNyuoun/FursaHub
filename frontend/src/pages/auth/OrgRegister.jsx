import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orgRegister } from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ORG_TYPES } from '../../utils/constants';

const OrgRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    type: '',
    description: '',
    phoneNumber: '',
    location: 'Kakuma',
    website: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await orgRegister(form);
      setSuccess('Registration submitted. You will be notified once your account is approved by FursaHub admin.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '40px 32px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            color: 'var(--green-primary)'
          }}>
            FursaHub
          </h1>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}>
            Organisation Portal
          </p>
        </div>

        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Register your organisation
        </h2>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '24px'
        }}>
          Your account will be reviewed and approved by FursaHub admin before you can post courses.
        </p>

        {error && (
          <div style={{
            background: '#fff5f5',
            border: '1px solid #feb2b2',
            borderRadius: 'var(--radius)',
            padding: '12px',
            marginBottom: '16px',
            fontSize: '0.9rem',
            color: '#c53030'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#f0fff4',
            border: '1px solid #9ae6b4',
            borderRadius: 'var(--radius)',
            padding: '12px',
            marginBottom: '16px',
            fontSize: '0.9rem',
            color: '#276749'
          }}>
            {success}
            <br />
            <Link to="/org/login" style={{
              color: 'var(--green-primary)',
              fontWeight: '600',
              marginTop: '8px',
              display: 'inline-block'
            }}>
              Go to login
            </Link>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <Input
              label="Organisation Name"
              type="text"
              name="name"
              placeholder="e.g. K-Node Kakuma"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="organisation@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone Number"
              type="text"
              name="phoneNumber"
              placeholder="+254700000000"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                Organisation Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <option value="">Select organisation type</option>
                {ORG_TYPES.map(ot => (
                  <option key={ot.value} value={ot.value}>
                    {ot.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Brief description of your organisation and what you do in Kakuma"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  resize: 'vertical'
                }}
              />
            </div>

            <Input
              label="Location"
              type="text"
              name="location"
              placeholder="Kakuma"
              value={form.location}
              onChange={handleChange}
            />

            <Input
              label="Website (optional)"
              type="text"
              name="website"
              placeholder="https://yourwebsite.com"
              value={form.website}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              style={{ marginTop: '8px' }}
            >
              Submit Registration
            </Button>
          </form>
        )}

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.9rem',
          color: 'var(--text-muted)'
        }}>
          Already registered?{' '}
          <Link to="/org/login" style={{
            color: 'var(--green-primary)',
            fontWeight: '600'
          }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrgRegister;