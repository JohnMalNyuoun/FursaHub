import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orgLogin } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const OrgLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await orgLogin(form);
      login(res.data.organisation, res.data.token);
      navigate('/org/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
            Organisation Portal
          </p>
        </div>

        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '24px'
        }}>
          Sign in to your organisation
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
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            style={{ marginTop: '8px' }}
          >
            Sign In
          </Button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.9rem',
          color: 'var(--text-muted)'
        }}>
          Don't have an account?{' '}
          <Link to="/org/register" style={{
            color: 'var(--green-primary)',
            fontWeight: '600'
          }}>
            Register your organisation
          </Link>
        </p>

        <p style={{
          textAlign: 'center',
          marginTop: '12px',
          fontSize: '0.9rem',
          color: 'var(--text-muted)'
        }}>
          Are you a youth?{' '}
          <Link to="/login" style={{
            color: 'var(--green-primary)',
            fontWeight: '600'
          }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrgLogin;