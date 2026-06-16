import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { getYouthProfile } from '../../services/profileService';

const SETTINGS_KEY = 'fh_settings_youth';

const YouthProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    privacy: {
      profileVisible: true,
      activityVisible: true
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setSettings((current) => ({
        ...current,
        ...parsed,
        privacy: {
          ...current.privacy,
          ...(parsed.privacy || {})
        }
      }));
    } catch (err) {
      console.error('Failed to parse youth settings', err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getYouthProfile();
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Loader />;

  const updatePrivacy = (key, value) => {
    setSettings((current) => ({
      ...current,
      privacy: {
        ...current.privacy,
        [key]: value
      }
    }));
  };

  return (
    <div className="fh-page">
      <Navbar />

      <div className="fh-section-head">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
            My Profile
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            View your personal information
          </p>
        </div>
      </div>

      <div className="fh-container">
        {error ? (
          <div style={{
            background: 'rgba(229,62,62,0.1)',
            border: '1px solid #E53E3E',
            borderRadius: 'var(--radius)',
            padding: '12px',
            color: '#FCA5A5',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        ) : (
          <div style={{
            background: '#1A3357',
            border: '1px solid #2A4A6B',
            borderRadius: '16px',
            boxShadow: 'var(--card-shadow)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderBottom: '1px solid #2A4A6B'
            }}>
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
                  fontSize: '1.3rem',
                  fontWeight: '800'
                }}>
                  {(profile?.fullName || 'Y').charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '4px' }}>
                  {profile?.fullName || 'Youth User'}
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#B8D0E8' }}>{profile?.email}</p>
              </div>
            </div>

            <div style={{ padding: '24px', display: 'grid', gap: '12px' }}>
              {[
                ['Community', profile?.communityType?.replace('_', ' ') || 'N/A'],
                ['Age', profile?.age || 'N/A'],
                ['Gender', profile?.gender || 'N/A'],
                ['Phone Number', profile?.phoneNumber || 'N/A'],
                ['Bio', profile?.bio || 'N/A'],
                ['Notifications', profile?.notificationsEnabled ? 'Enabled' : 'Disabled']
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'grid',
                  gridTemplateColumns: '170px 1fr',
                  gap: '12px',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: '#7A9BB5', fontWeight: 700 }}>{label}</span>
                  <span style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{
              padding: '24px',
              borderTop: '1px solid #2A4A6B',
              background: '#152A47'
            }}>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '14px' }}>
                Settings
              </h3>

              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px', alignItems: 'center' }}>
                  <span style={{ color: '#7A9BB5', fontWeight: 700 }}>Dark / Light Mode</span>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings((current) => ({ ...current, theme: e.target.value }))}
                    style={{
                      width: '220px',
                      padding: '10px 12px',
                      background: '#1A3357',
                      color: '#FFFFFF',
                      border: '1px solid #2A4A6B',
                      borderRadius: '10px'
                    }}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px', alignItems: 'center' }}>
                  <span style={{ color: '#7A9BB5', fontWeight: 700 }}>Language</span>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings((current) => ({ ...current, language: e.target.value }))}
                    style={{
                      width: '220px',
                      padding: '10px 12px',
                      background: '#1A3357',
                      color: '#FFFFFF',
                      border: '1px solid #2A4A6B',
                      borderRadius: '10px'
                    }}
                  >
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px', alignItems: 'start' }}>
                  <span style={{ color: '#7A9BB5', fontWeight: 700 }}>Privacy Preferences</span>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <label style={{ color: '#FFFFFF', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={settings.privacy.profileVisible}
                        onChange={(e) => updatePrivacy('profileVisible', e.target.checked)}
                      />
                      Allow profile visibility
                    </label>
                    <label style={{ color: '#FFFFFF', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={settings.privacy.activityVisible}
                        onChange={(e) => updatePrivacy('activityVisible', e.target.checked)}
                      />
                      Allow activity visibility
                    </label>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '12px' }}>
                Help and Support
              </h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                <details style={{ background: '#1A3357', border: '1px solid #2A4A6B', borderRadius: '10px', padding: '10px 12px' }}>
                  <summary style={{ color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>Frequently Asked Questions (FAQs)</summary>
                  <p style={{ color: '#B8D0E8', fontSize: '0.88rem', marginTop: '8px' }}>
                    Visit the help center from your dashboard for account, applications, and notifications FAQs.
                  </p>
                </details>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a
                    href="mailto:support@fursahub.org"
                    style={{
                      background: '#F5A623',
                      color: '#1E3A5F',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      textDecoration: 'none'
                    }}
                  >
                    Contact Support
                  </a>

                  <a
                    href="https://fursahub.onrender.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      border: '1px solid #2A4A6B',
                      color: '#B8D0E8',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    User Guides and Tutorials
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouthProfile;
