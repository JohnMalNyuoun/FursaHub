import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { getYouthProfile } from '../../services/profileService';

const YouthProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoFailed, setPhotoFailed] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

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

  const initials = useMemo(() => {
    const name = profile?.fullName || '';
    return (
      name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'YU'
    );
  }, [profile]);

  const photoVersionedSrc = useMemo(() => {
    if (!profile?.photo) return '';
    const version = profile?.updatedAt ? encodeURIComponent(profile.updatedAt) : '';
    if (!version) return profile.photo;
    const separator = profile.photo.includes('?') ? '&' : '?';
    return `${profile.photo}${separator}v=${version}`;
  }, [profile?.photo, profile?.updatedAt]);

  const registrationId = profile?._id || 'N/A';
  const trainingPhaseProgress = profile?.trainingPhaseProgress ?? 0;
  const mentorshipAttendanceRate = profile?.mentorshipAttendanceRate ?? 0;
  const capstoneProgress = profile?.capstoneProgress ?? 0;
  const skills = profile?.skills || [];
  const activityLogs = profile?.activityLogs || [];

  useEffect(() => {
    setPhotoFailed(false);
  }, [profile?.photo]);

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'linear-gradient(180deg, #F3F7FB 0%, #FFFFFF 30%, #EDF3FA 100%)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 40px' }}>
        {error ? (
          <div style={{
            background: '#FFF7F7',
            border: '1px solid #F5C2C7',
            borderRadius: '14px',
            padding: '14px 16px',
            color: '#8A1F2B',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        ) : null}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          <section style={{
            background: '#1A3357',
            border: '1px solid #2A4A6B',
            borderRadius: '18px',
            boxShadow: '0 10px 24px rgba(15, 32, 53, 0.18)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #2A4A6B' }}>
              <button
                type="button"
                onClick={() => setShowPhotoPreview(true)}
                title="View profile image"
                style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                {profile?.photo && !photoFailed ? (
                  <img
                    src={photoVersionedSrc}
                    alt={profile.fullName}
                    onError={() => setPhotoFailed(true)}
                    style={{
                      width: '112px',
                      height: '112px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid #F5A623'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '112px',
                    height: '112px',
                    borderRadius: '50%',
                    background: '#F5A623',
                    color: '#1E3A5F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '2rem',
                    border: '4px solid #F5A623'
                  }}>
                    {initials}
                  </div>
                )}
              </button>

              <div style={{ marginTop: '16px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(245,166,35,0.16)',
                  color: '#F5A623',
                  borderRadius: '999px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  marginBottom: '12px'
                }}>
                  Active Youth Account
                </div>
                <h2 style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>
                  {profile?.fullName || 'Youth User'}
                </h2>
                <p style={{ color: '#B8D0E8', fontSize: '0.9rem', marginBottom: '4px' }}>
                  @{profile?.username || 'username_not_set'}
                </p>
                <p style={{ color: '#7A9BB5', fontSize: '0.84rem', marginBottom: '16px' }}>
                  {profile?.communityType?.replace('_', ' ') || 'Community not set'}
                </p>
                <Link
                  to="/settings"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F5A623',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    borderRadius: '999px',
                    padding: '12px 16px',
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  }}
                >
                  Edit Profile & Settings
                </Link>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 800, marginBottom: '10px' }}>
                Personal Information
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  ['Name', profile?.fullName || 'N/A'],
                  ['Age', profile?.age || 'N/A'],
                  ['Registration ID', registrationId],
                  ['Email', profile?.email || 'N/A'],
                  ['Phone', profile?.phoneNumber || 'N/A'],
                  ['Gender', profile?.gender || 'N/A'],
                  ['Language', profile?.language || 'N/A'],
                  ['Theme', profile?.theme || 'N/A']
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '12px', fontSize: '0.88rem' }}>
                    <span style={{ color: '#7A9BB5', fontWeight: 700 }}>{label}</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 600, wordBreak: 'break-word' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '18px' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 800, marginBottom: '10px' }}>
                  Bio
                </h3>
                <p style={{ color: '#B8D0E8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                  {profile?.bio || 'No bio yet. Add one from Settings.'}
                </p>
              </div>
            </div>
          </section>

          <section style={{ display: 'grid', gap: '24px' }}>
            <div style={{
              background: '#1A3357',
              border: '1px solid #2A4A6B',
              borderRadius: '18px',
              boxShadow: '0 10px 24px rgba(15, 32, 53, 0.18)',
              padding: '24px'
            }}>
              <p style={{ margin: '0 0 6px 0', color: '#F5A623', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Right Side
              </p>
              <h3 style={{ margin: '0 0 18px 0', color: '#FFFFFF', fontSize: '1.08rem', fontWeight: 800 }}>
                Progress Tracking Canvas
              </h3>

              <div style={{ display: 'grid', gap: '18px' }}>
                {[
                  ['Training Phase Progress', trainingPhaseProgress],
                  ['Mentorship Attendance Rate', mentorshipAttendanceRate],
                  ['Capstone Progress', capstoneProgress]
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem' }}>{label}</span>
                      <span style={{ color: '#F5A623', fontWeight: 800, fontSize: '0.88rem' }}>{value}%</span>
                    </div>
                    <div style={{ height: '12px', background: '#152A47', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.max(0, Math.min(100, value))}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #4A9EFF 0%, #7A9BB5 100%)',
                        borderRadius: '999px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: '#1A3357',
              border: '1px solid #2A4A6B',
              borderRadius: '18px',
              boxShadow: '0 10px 24px rgba(15, 32, 53, 0.18)',
              padding: '24px'
            }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.08rem', fontWeight: 800, marginBottom: '14px' }}>
                Skills
              </h3>
              {skills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {skills.map((skill) => (
                    <span key={skill} style={{
                      background: '#0F2035',
                      color: '#B8D0E8',
                      border: '1px solid #2A4A6B',
                      borderRadius: '999px',
                      padding: '8px 12px',
                      fontSize: '0.84rem',
                      fontWeight: 700
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, color: '#B8D0E8', fontSize: '0.9rem' }}>
                  No skills listed yet.
                </p>
              )}
            </div>

            <div style={{
              background: '#1A3357',
              border: '1px solid #2A4A6B',
              borderRadius: '18px',
              boxShadow: '0 10px 24px rgba(15, 32, 53, 0.18)',
              padding: '24px'
            }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.08rem', fontWeight: 800, marginBottom: '14px' }}>
                Activity Log
              </h3>
              {activityLogs.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {activityLogs.map((log, index) => (
                    <div key={`${log.timestamp || index}-${index}`} style={{
                      padding: '14px 16px',
                      border: '1px solid #2A4A6B',
                      borderRadius: '14px',
                      background: '#152A47'
                    }}>
                      <p style={{ margin: '0 0 6px 0', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 600 }}>
                        {log.text || log.message || 'Activity recorded'}
                      </p>
                      <p style={{ margin: 0, color: '#7A9BB5', fontSize: '0.78rem' }}>
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'No timestamp available'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, color: '#B8D0E8', fontSize: '0.9rem' }}>
                  No activity logs available yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      {showPhotoPreview && (
        <div
          onClick={() => setShowPhotoPreview(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,32,53,0.82)',
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
              background: '#1A3357',
              border: '1px solid #2A4A6B',
              borderRadius: '18px',
              padding: '16px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            {profile?.photo && !photoFailed ? (
              <img
                src={photoVersionedSrc}
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
                {initials}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowPhotoPreview(false)}
              style={{
                marginTop: '12px',
                background: '#F5A623',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '999px',
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

export default YouthProfile;
