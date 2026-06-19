import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
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

const CLOUDINARY_CLOUD_NAME = 'dkxjwhxne';
const CLOUDINARY_PROFILE_PRESET = 'Fursahub-profile';
const CLOUDINARY_PROFILE_PRESET_FALLBACK = 'fursahub-courses';

const YouthSettings = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [photoFailed, setPhotoFailed] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [localPhotoPreview, setLocalPhotoPreview] = useState('');

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
    theme: 'light',
    notificationsEnabled: true
  });

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
        theme: res.data.theme || 'light',
        notificationsEnabled: Boolean(res.data.notificationsEnabled)
      });
      document.documentElement.setAttribute('data-theme', res.data.theme || 'light');
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

  useEffect(() => {
    setPhotoFailed(false);
  }, [profile?.photo]);

  useEffect(() => {
    if (!newPhoto) {
      setLocalPhotoPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(newPhoto);
    setLocalPhotoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [newPhoto]);

  const profilePhotoSrc = useMemo(() => {
    if (localPhotoPreview) return localPhotoPreview;
    if (!profile?.photo) return '';
    const version = profile?.updatedAt ? encodeURIComponent(profile.updatedAt) : '';
    if (!version) return profile.photo;
    const separator = profile.photo.includes('?') ? '&' : '?';
    return `${profile.photo}${separator}v=${version}`;
  }, [localPhotoPreview, profile?.photo, profile?.updatedAt]);

  const savePublicProfile = async () => {
    setError('');
    setNotice('');
    try {
      const profilePayload = {
        fullName: publicForm.fullName,
        bio: publicForm.bio,
        ...(publicForm.username.trim() ? { username: publicForm.username } : {})
      };

      if (newPhoto) {
        setPhotoFailed(false);
        const uploadWithPreset = async (preset) => {
          const uploadFormData = new FormData();
          uploadFormData.append('file', newPhoto);
          uploadFormData.append('upload_preset', preset);

          const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: 'POST',
              body: uploadFormData
            }
          );

          const cloudinaryData = await cloudinaryResponse.json();
          return { cloudinaryResponse, cloudinaryData };
        };

        let { cloudinaryResponse, cloudinaryData } = await uploadWithPreset(CLOUDINARY_PROFILE_PRESET);

        if (!cloudinaryData?.secure_url) {
          const fallbackResult = await uploadWithPreset(CLOUDINARY_PROFILE_PRESET_FALLBACK);
          cloudinaryResponse = fallbackResult.cloudinaryResponse;
          cloudinaryData = fallbackResult.cloudinaryData;
        }

        if (!cloudinaryResponse.ok || !cloudinaryData?.secure_url) {
          throw new Error(cloudinaryData?.error?.message || 'Cloudinary upload failed');
        }

        profilePayload.photo = cloudinaryData.secure_url;

        const photoRes = await updateYouthPhoto({ photoUrl: cloudinaryData.secure_url });
        const newPhotoUrl =
          photoRes?.data?.photo
          || photoRes?.photo
          || photoRes?.data?.data?.photo
          || cloudinaryData.secure_url;

        if (newPhotoUrl) {
          updateUser({ photo: newPhotoUrl });
          setProfile((current) => ({
            ...(current || {}),
            ...publicForm,
            photo: newPhotoUrl,
            updatedAt: new Date().toISOString()
          }));
          setPhotoFailed(false);
        } else {
          throw new Error('Photo uploaded but no image URL was returned by the server.');
        }

        setNewPhoto(null);
      }

      const profileRes = await updateYouthProfile(profilePayload);
      const updatedProfile = profileRes?.data || {};

      setProfile((current) => ({
        ...(current || {}),
        ...updatedProfile,
        updatedAt: new Date().toISOString()
      }));
      updateUser({
        fullName: updatedProfile.fullName || publicForm.fullName,
        ...(updatedProfile.username ? { username: updatedProfile.username } : {})
      });

      setNotice('Public profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update public profile');
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
            Settings
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            Configure your public profile, privacy, and personal preferences.
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

        <section style={cardStyle}>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px' }}>
            1. Public Profile Info
          </h2>
          <p style={{ color: '#7A9BB5', fontSize: '0.84rem', marginBottom: '16px' }}>
            This controls what other users and the system see about you.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <button
              type="button"
              onClick={() => setShowPhotoPreview(true)}
              title="View profile image"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              {profilePhotoSrc && !photoFailed ? (
                <img
                  src={profilePhotoSrc}
                  alt={profile.fullName}
                  onError={() => setPhotoFailed(true)}
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
                  {(profile?.fullName || 'YU').slice(0, 2).toUpperCase()}
                </div>
              )}
            </button>

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
              {profilePhotoSrc && !localPhotoPreview && (
                <a
                  href={profilePhotoSrc}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#F5A623', fontSize: '0.75rem', marginTop: '6px', display: 'inline-block' }}
                >
                  Open current photo URL
                </a>
              )}
              <p style={{ color: '#7A9BB5', fontSize: '0.72rem', marginTop: '4px' }}>
                Click avatar to preview
              </p>
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

        <section style={cardStyle}>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px' }}>
            2. Account & Privacy (Private)
          </h2>
          <p style={{ color: '#7A9BB5', fontSize: '0.84rem', marginBottom: '16px' }}>
            Sensitive information below is private and not publicly visible.
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

      {showPhotoPreview && (
        <div
          onClick={() => setShowPhotoPreview(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#152A47',
              border: '1px solid #2A4A6B',
              borderRadius: '14px',
              padding: '16px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            {profile?.photo && !photoFailed ? (
              <img
                src={profilePhotoSrc}
                alt={profile?.fullName || 'Profile photo'}
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '10px' }}
              />
            ) : (
              <div style={{
                width: '220px',
                height: '220px',
                margin: '0 auto',
                borderRadius: '50%',
                background: '#F5A623',
                color: '#1E3A5F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '3rem'
              }}>
                {(profile?.fullName || 'YU').slice(0, 2).toUpperCase()}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowPhotoPreview(false)}
              style={{
                marginTop: '12px',
                background: '#F5A623',
                color: '#1E3A5F',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouthSettings;
