import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orgReinstateRequest } from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const OrgReinstate = () => {
  const [form, setForm] = useState({ email: '', password: '', message: '' });
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
      const res = await orgReinstateRequest(form);
      setSuccess(res.message || 'Reinstatement request submitted.');
      setForm({ email: '', password: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit reinstatement request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0F2035 0%, #1E3A5F 100%)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '24px 16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        padding: '32px 20px',
        marginTop: '24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: '#F5A623',
            letterSpacing: '-0.5px'
          }}>
            FursaHub
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Organisation Reinstatement
          </p>
        </div>

        <h2 style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Request to be reinstated
        </h2>
        <p style={{ fontSize: '0.86rem', color: '#B8D0E8', marginBottom: '20px' }}>
          Confirm your organisation credentials and describe how you have addressed the issue. A FursaHub admin will review your request.
        </p>

        {error && (
          <div style={{
            background: '#2D1515',
            borderLeft: '4px solid #E53E3E',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '0.88rem',
            color: '#FCA5A5'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#0F2A1F',
            borderLeft: '4px solid #10B981',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '0.88rem',
            color: '#A7F3D0'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Organisation Email"
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

          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            color: '#B8D0E8',
            fontWeight: 700,
            marginBottom: '6px'
          }}>
            Why should we reinstate this organisation?
          </label>
          <textarea
            name="message"
            placeholder="Explain how the suspension reason has been addressed."
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '0.9rem',
              color: '#FFFFFF',
              background: '#152A47',
              border: '1px solid #2A4A6B',
              borderRadius: '10px',
              resize: 'vertical',
              marginBottom: '14px'
            }}
          />

          <Button type="submit" fullWidth loading={loading}>
            Submit reinstatement request
          </Button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '0.88rem',
          color: 'var(--text-muted)'
        }}>
          Back to{' '}
          <Link to="/org/login" style={{ color: '#F5A623', fontWeight: 700 }}>
            organisation login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrgReinstate;
