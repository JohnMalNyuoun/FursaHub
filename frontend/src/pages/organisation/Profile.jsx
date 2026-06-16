import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { getOrgProfile } from '../../services/profileService';

const OrgProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getOrgProfile();
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

  return (
    <div className="fh-page">
      <Navbar />

      <div className="fh-section-head">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
            Organisation Profile
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            View your organisation details
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
              {profile?.logo ? (
                <img
                  src={profile.logo}
                  alt={profile.name}
                  style={{ width: '72px', height: '72px', borderRadius: '16px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  background: '#F5A623',
                  color: '#1E3A5F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  fontWeight: '800'
                }}>
                  {(profile?.name || 'O').charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '4px' }}>
                  {profile?.name || 'Organisation'}
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#B8D0E8' }}>{profile?.email}</p>
              </div>
            </div>

            <div style={{ padding: '24px', display: 'grid', gap: '12px' }}>
              {[
                ['Type', profile?.type || 'N/A'],
                ['Status', profile?.status || 'N/A'],
                ['Phone Number', profile?.phoneNumber || 'N/A'],
                ['Location', profile?.location || 'N/A'],
                ['Website', profile?.website || 'N/A'],
                ['Description', profile?.description || 'N/A'],
                ['Notifications', profile?.notificationsEnabled ? 'Enabled' : 'Disabled']
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'grid',
                  gridTemplateColumns: '170px 1fr',
                  gap: '12px',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: '#7A9BB5', fontWeight: 700 }}>{label}</span>
                  <span style={{ color: '#FFFFFF', textTransform: 'capitalize', wordBreak: 'break-word' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgProfile;
