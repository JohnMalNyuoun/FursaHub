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
      background: 'linear-gradient(160deg, #0F2035 0%, #1E3A5F 100%)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '24px 16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#1A3357',
        border: '1px solid #2A4A6B',
        borderRadius: '20px',
        padding: '32px 20px',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
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
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}>
            Organisation Portal
          </p>
        </div>

        <h2 style={{
          fontSize: '1.15rem',
          fontWeight: 800,
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
            background: 'rgba(245,166,35,0.15)',
            borderLeft: '4px solid #F5A623',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '0.88rem',
            color: '#FDF3E0'
          }}>
            {success}
            <br />
            <Link to="/org/login" style={{
              color: '#F5A623',
              fontWeight: 700,
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
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
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
                  padding: '13px 16px',
                  fontSize: '0.95rem',
                  color: '#FFFFFF',
                  background: '#152A47',
                  border: '1.5px solid #2A4A6B',
                  borderRadius: '10px',
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
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
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
                  padding: '13px 16px',
                  fontSize: '0.95rem',
                  color: '#FFFFFF',
                  background: '#152A47',
                  border: '1.5px solid #2A4A6B',
                  borderRadius: '10px',
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
          marginTop: '20px',
          fontSize: '0.88rem',
          color: 'var(--text-muted)'
        }}>
          Already registered?{' '}
          <Link to="/org/login" style={{
            color: '#F5A623',
            fontWeight: 700
          }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrgRegister;