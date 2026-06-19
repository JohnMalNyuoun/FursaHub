import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import {
  getYouthProfile,
  changeYouthName,
  changeYouthPassword,
  requestYouthEmailChange,
  verifyYouthEmailChange
} from '../../services/profileService';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: '#152A47',
  color: '#FFFFFF',
  border: '1px solid #2A4A6B',
  borderRadius: '10px',
  fontSize: '0.9rem'
};

const cardStyle = {
  padding: '0'
};

const YouthAccount = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [emailForm, setEmailForm] = useState({ newEmail: '', token: '' });
  const [nameForm, setNameForm] = useState({ newFullName: '', currentPassword: '' });
  const [activeEditor, setActiveEditor] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const loadProfile = async () => {
    try {
      const res = await getYouthProfile();
      setProfile(res.data);
      setNameForm((current) => ({
        ...current,
        newFullName: res.data.fullName || ''
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load account');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get('verifyEmailToken');
    if (tokenFromUrl) {
      setEmailForm((current) => ({ ...current, token: tokenFromUrl }));
    }
  }, []);

  const requestEmailVerification = async () => {
    setError('');
    setNotice('');
    try {
      const res = await requestYouthEmailChange(emailForm.newEmail);
      if (!res.data.emailDeliveryConfigured) {
        setNotice('Email service is not configured yet. Configure SMTP to deliver verification links.');
      } else {
        setNotice('Verification link sent to the new email address.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification link');
    }
  };

  const saveNameChange = async () => {
    setError('');
    setNotice('');
    try {
      const res = await changeYouthName({
        newFullName: nameForm.newFullName,
        currentPassword: nameForm.currentPassword
      });

      const updatedName = res?.data?.fullName || nameForm.newFullName;
      setProfile((current) => ({ ...(current || {}), fullName: updatedName }));
      updateUser({ fullName: updatedName });
      setNameForm((current) => ({ ...current, currentPassword: '' }));
      setNotice('Name updated successfully. You can change it again after 30 days.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update name');
    }
  };

  const verifyEmailToken = async () => {
    setError('');
    setNotice('');
    try {
      await verifyYouthEmailChange(emailForm.token);
      await loadProfile();
      setEmailForm((current) => ({ ...current, token: '', newEmail: '' }));
      setNotice('Email updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify email token');
    }
  };

  const savePassword = async () => {
    setError('');
    setNotice('');
    try {
      await changeYouthPassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setNotice('Password changed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fh-page">
      <Navbar />

      <div className="fh-section-head">
        <div>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F5A623',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="fh-container" style={{ display: 'grid', gap: '10px' }}>
        {error && (
          <div style={{
            background: 'rgba(229,62,62,0.1)',
            border: '1px solid #E53E3E',
            borderRadius: '12px',
            padding: '12px',
            color: '#FCA5A5'
          }}>
            {error}
          </div>
        )}
        {notice && (
          <div style={{
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid #10B981',
            borderRadius: '12px',
            padding: '12px',
            color: '#A7F3D0'
          }}>
            {notice}
          </div>
        )}

        <section style={cardStyle}>
          <button
            type="button"
            onClick={() => setActiveEditor((prev) => (prev === 'name' ? null : 'name'))}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: 'transparent',
              border: '1px solid #2A4A6B',
              borderRadius: '10px',
              padding: '10px 12px',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>Name</span>
            <span style={{ color: '#F5A623', fontSize: '0.82rem', fontWeight: 700 }}>
              {activeEditor === 'name' ? 'Hide' : 'Edit'}
            </span>
          </button>

          {activeEditor === 'name' && (
            <div style={{ marginTop: '14px' }}>
              <p style={{ color: '#7A9BB5', fontSize: '0.84rem', marginBottom: '16px' }}>
                You can change your name once every 30 days. Enter your account password to confirm.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#B8D0E8', fontSize: '0.82rem', display: 'block' }}>Current name</label>
                <input style={inputStyle} value={profile?.fullName || ''} readOnly />
              </div>

              <div style={{ display: 'grid', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ color: '#B8D0E8', fontSize: '0.82rem' }}>New name</label>
                  <input
                    style={inputStyle}
                    value={nameForm.newFullName}
                    onChange={(e) => setNameForm((c) => ({ ...c, newFullName: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ color: '#B8D0E8', fontSize: '0.82rem' }}>Account password</label>
                  <input
                    style={inputStyle}
                    type="password"
                    value={nameForm.currentPassword}
                    onChange={(e) => setNameForm((c) => ({ ...c, currentPassword: e.target.value }))}
                  />
                </div>
                <Button variant="outline" onClick={saveNameChange}>Save Name</Button>
              </div>
            </div>
          )}
        </section>

        <section style={{ ...cardStyle, paddingTop: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveEditor((prev) => (prev === 'email' ? null : 'email'))}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: 'transparent',
              border: '1px solid #2A4A6B',
              borderRadius: '10px',
              padding: '10px 12px',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>Email</span>
            <span style={{ color: '#F5A623', fontSize: '0.82rem', fontWeight: 700 }}>
              {activeEditor === 'email' ? 'Hide' : 'Edit'}
            </span>
          </button>

          {activeEditor === 'email' && (
            <div style={{ marginTop: '14px' }}>
              <p style={{ color: '#7A9BB5', fontSize: '0.84rem', marginBottom: '16px' }}>
                Change your login email securely using a verification token.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#B8D0E8', fontSize: '0.82rem', display: 'block' }}>Current email</label>
                <input style={inputStyle} value={profile?.email || ''} readOnly />
              </div>

              <div style={{ display: 'grid', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ color: '#B8D0E8', fontSize: '0.82rem' }}>New email address</label>
                  <input
                    style={inputStyle}
                    type="email"
                    value={emailForm.newEmail}
                    onChange={(e) => setEmailForm((c) => ({ ...c, newEmail: e.target.value }))}
                  />
                </div>
                <Button onClick={requestEmailVerification}>Send Verification Link</Button>

                <div>
                  <label style={{ color: '#B8D0E8', fontSize: '0.82rem' }}>Email verification token</label>
                  <input
                    style={inputStyle}
                    value={emailForm.token}
                    onChange={(e) => setEmailForm((c) => ({ ...c, token: e.target.value }))}
                  />
                </div>
                <Button variant="outline" onClick={verifyEmailToken}>Verify Email Change</Button>
              </div>
            </div>
          )}
        </section>

        <section style={{ ...cardStyle, paddingTop: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveEditor((prev) => (prev === 'password' ? null : 'password'))}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: 'transparent',
              border: '1px solid #2A4A6B',
              borderRadius: '10px',
              padding: '10px 12px',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>Password</span>
            <span style={{ color: '#F5A623', fontSize: '0.82rem', fontWeight: 700 }}>
              {activeEditor === 'password' ? 'Hide' : 'Edit'}
            </span>
          </button>

          {activeEditor === 'password' && (
            <div style={{ display: 'grid', gap: '10px', marginTop: '14px' }}>
              <input
                type="password"
                placeholder="Current password"
                style={inputStyle}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((c) => ({ ...c, currentPassword: e.target.value }))}
              />
              <input
                type="password"
                placeholder="New password"
                style={inputStyle}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((c) => ({ ...c, newPassword: e.target.value }))}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                style={inputStyle}
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm((c) => ({ ...c, confirmNewPassword: e.target.value }))}
              />
              <Button variant="outline" onClick={savePassword}>Save Password</Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default YouthAccount;
