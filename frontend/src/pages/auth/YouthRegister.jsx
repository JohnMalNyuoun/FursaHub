import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { youthRegister } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COMMUNITY_TYPES } from '../../utils/constants';

const YouthRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    communityType: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await youthRegister(form);
      login(res.data.user, res.data.token);
      navigate('/home');
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
        maxWidth: '420px',
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
            Your next opportunity starts here
          </p>
        </div>

        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '24px'
        }}>
          Create your account
        </h2>

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

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="Your full name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="your@email.com"
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Community Type
            </label>
            <select
              name="communityType"
              value={form.communityType}
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
              <option value="">Select community type</option>
              {COMMUNITY_TYPES.map(ct => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            style={{ marginTop: '8px' }}
          >
            Create Account
          </Button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.9rem',
          color: 'var(--text-muted)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
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

export default YouthRegister;