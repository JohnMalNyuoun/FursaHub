import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  getYouthProfile,
  updateYouthProfile,
  updateYouthPhoto,
  changeYouthPassword,
  requestYouthEmailChange,
  verifyYouthEmailChange,
  updateYouthTheme,
  updateYouthNotifications
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
  background: '#1A3357',
  border: '1px solid #2A4A6B',
  borderRadius: '16px',
  padding: '20px'
};

const YouthProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [publicForm, setPublicForm] = useState({
    fullName: '',
    username: '',
    bio: ''
  });
  const [newPhoto, setNewPhoto] = useState(null);

  const [emailForm, setEmailForm] = useState({ newEmail: '', token: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    notificationsEnabled: true
  });

  const initials = useMemo(() => {
    const name = profile?.fullName || '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'YU';
  }, [profile]);

  const loadProfile = async () => {
    try {
      const res = await getYouthProfile();
      setProfile(res.data);
      setPublicForm({
        fullName: res.data.fullName || '',
        username: res.data.username || '',
        bio: res.data.bio || ''
      });
      setPreferences({
        theme: res.data.theme || 'dark',
        notificationsEnabled: Boolean(res.data.notificationsEnabled)
      });
      document.documentElement.setAttribute('data-theme', res.data.theme || 'dark');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load settings');
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

  const savePublicProfile = async () => {
    setError('');
    setNotice('');
    try {
      await updateYouthProfile(publicForm);

      if (newPhoto) {
        const formData = new FormData();
        formData.append('photo', newPhoto);
        await updateYouthPhoto(formData);
        setNewPhoto(null);
      }

      await loadProfile();
      setNotice('Public profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update public profile');
    }
  };

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

  const savePreferences = async () => {
    setError('');
    setNotice('');
    try {
      await Promise.all([
        updateYouthTheme(preferences.theme),
        updateYouthNotifications(preferences.notificationsEnabled)
      ]);
      document.documentElement.setAttribute('data-theme', preferences.theme);
      setNotice('Preferences updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update preferences');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fh-page">
      <Navbar />

      <div className="fh-section-head">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
            End-User Settings
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            Manage your public profile, account privacy, and preferences.
          </p>
        </div>
      </div>

      <div className="fh-container" style={{ display: 'grid', gap: '16px' }}>
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

        {/* 1. Public profile info */}
        <section style={cardStyle}>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px' }}>
            1. Public Profile Info
          </h2>
          <p style={{ color: '#7A9BB5', fontSize: '0.84rem', marginBottom: '16px' }}>
            This controls what other users and the system see about you.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            {profile?.photo ? (
              <img
                src={profile.photo}
                alt={profile.fullName}
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#F5A623',
                color: '#1E3A5F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem'
              }}>
                {initials}
              </div>
            )}

            <div>
              <label style={{ color: '#B8D0E8', fontSize: '0.82rem', marginBottom: '6px', display: 'block' }}>
                Avatar / Profile picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPhoto(e.target.files?.[0] || null)}
                style={{ color: '#FFFFFF', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            <div>
              <label style={{ color: '#B8D0E8', fontSize: '0.82rem' }}>Display name</label>
              <input
                style={inputStyle}
                value={publicForm.fullName}
                onChange={(e) => setPublicForm((c) => ({ ...c, fullName: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ color: '#B8D0E8', fontSize: '0.82rem' }}>Username</label>
              <input
                style={inputStyle}
                value={publicForm.username}
                onChange={(e) => setPublicForm((c) => ({ ...c, username: e.target.value }))}
                placeholder="your_username"
              />
            </div>
            <div>
              <label style={{ color: '#B8D0E8', fontSize: '0.82rem' }}>Bio / Short description</label>
              <textarea
                rows={3}
                style={inputStyle}
                value={publicForm.bio}
                onChange={(e) => setPublicForm((c) => ({ ...c, bio: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <Button onClick={savePublicProfile}>Save Public Profile</Button>
          </div>
        </section>

        {/* 2. Account & privacy */}
        <section style={cardStyle}>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px' }}>
            2. Account & Privacy (Private)
          </h2>
          <p style={{ color: '#7A9BB5', fontSize: '0.84rem', marginBottom: '16px' }}>
            Sensitive information below is never public.
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

          <details style={{
            background: '#152A47',
            border: '1px solid #2A4A6B',
            borderRadius: '12px',
            padding: '10px 12px'
          }}>
            <summary style={{ color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>
              Password management
            </summary>
            <div style={{ marginTop: '10px', display: 'grid', gap: '10px' }}>
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
              <Button variant="outline" onClick={savePassword}>Change Password</Button>
            </div>
          </details>
        </section>

        {/* 3. User preferences */}
        <section style={cardStyle}>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px' }}>
            3. User Preferences
          </h2>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ color: '#B8D0E8', fontSize: '0.82rem' }}>Interface theme</label>
              <select
                style={inputStyle}
                value={preferences.theme}
                onChange={(e) => setPreferences((c) => ({ ...c, theme: e.target.value }))}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <label style={{ color: '#FFFFFF', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={preferences.notificationsEnabled}
                onChange={(e) => setPreferences((c) => ({ ...c, notificationsEnabled: e.target.checked }))}
              />
              Notification toggles (enable/disable)
            </label>

            <div>
              <Button onClick={savePreferences}>Save Preferences</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default YouthProfile;
